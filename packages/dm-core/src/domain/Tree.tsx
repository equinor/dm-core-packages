import { AxiosResponse } from 'axios'
import { EBlueprint } from '../Enums'
import { useDMSS } from '../context/DMSSContext'
import { DmssAPI } from '../services'
import { TAttribute, TBlueprint, TPackage } from '../types'

type TTreeMap = {
  [nodeId: string]: TreeNode
}

const createContainedChildren = (
  document: any,
  parentNode: TreeNode,
  blueprint: TBlueprint
): TTreeMap => {
  const newChildren: TTreeMap = {}
  Object.entries(document).forEach(([key, value]: [string, any]) => {
    const type = Array.isArray(document)
      ? parentNode.type
      : blueprint.attributes?.find((attr: TAttribute) => attr.name === key)
          ?.attributeType
    if (!type) return false // If no attribute, there likely where some invalid keys. Ignore those
    // Skip adding nodes for primitives
    const PRIMITIVE_TYPES_TO_HIDE = ['string', 'number', 'boolean', 'integer']
    if (!PRIMITIVE_TYPES_TO_HIDE.includes(type)) {
      let childNodeId: string
      if (Number.isInteger(Number(key))) {
        // For arrays, bracket syntax is used to construct the node id: [key]
        childNodeId = `${parentNode.nodeId}[${key}]`
      } else {
        childNodeId = `${parentNode.nodeId}.${key}`
      }
      newChildren[childNodeId] = new TreeNode(
        parentNode.tree,
        childNodeId,
        value,
        type,
        parentNode,
        value?.name || key,
        false,
        false,
        // If this "new" node already exists on parent, instantiate the node with the same old children.
        // If not the tree will lose already loaded children whenever a node is expanded()
        parentNode.children?.[childNodeId]?.children || {}
      )
    }
  })

  return newChildren
}

const createFolderChildren = (
  document: any,
  parentNode: TreeNode
): TTreeMap => {
  const newChildren: TTreeMap = {}
  document.content?.forEach((resolvedChild: any) => {
    const newChildId = `${parentNode.dataSource}/$${resolvedChild?._id}`
    newChildren[newChildId] = new TreeNode(
      parentNode.tree,
      newChildId,
      resolvedChild,
      resolvedChild.type,
      parentNode,
      resolvedChild.name,
      false,
      false,
      parentNode.children?.[newChildId]?.children || {}
    )
  })
  return newChildren
}

const updateRootPackagesInTree = (
  rootPackages: { [key: string]: TPackage },
  tree: Tree,
  dataSource: string
) => {
  // Update content in a datasource. Search the DMSS database for root packages in a given datasource
  // and update the tree only if any packages from DMSS is missing in the tree.

  Object.values(rootPackages).forEach((rootPackage: TPackage) => {
    //Only update tree if package is missing.
    if (
      !Object.keys(tree.index[dataSource].children).includes(
        rootPackage._id ?? ''
      )
    ) {
      const rootPackageNode = new TreeNode( // Add the rootPackage nodes to the dataSource
        tree,
        `${dataSource}/$${rootPackage._id}`,
        rootPackage,
        EBlueprint.PACKAGE,
        tree.index[dataSource],
        rootPackage.name,
        true,
        false
      )
      tree.index[dataSource].children[rootPackage._id ?? ''] = rootPackageNode
    }
  })
}

export class TreeNode {
  tree: Tree
  type: string
  nodeId: string
  dataSource: string
  children: TTreeMap = {}
  parent?: TreeNode
  isRoot: boolean = false
  isDataSource: boolean = false
  entity: any
  name?: string
  message: string

  constructor(
    tree: Tree,
    nodeId: string,
    entity: any,
    type: string,
    parent: TreeNode | undefined = undefined,
    name: string | undefined = undefined,
    isRoot = false,
    isDataSource = false,
    children: TTreeMap = {},
    message: string = ''
  ) {
    this.tree = tree
    this.nodeId = nodeId
    this.dataSource = nodeId.split('/', 1)[0]
    this.parent = parent
    this.isRoot = isRoot
    this.isDataSource = isDataSource
    this.entity = entity
    this.name = name
    this.type = type
    this.children = children
    this.message = message
  }

  // Fetches the unresolved document of the node
  async fetch() {
    return this.tree.dmssApi
      .documentGet({
        address: this.nodeId,
        depth: 0,
      })
      .then((response: any) => response.data)
  }

  expand = () => {
    return new Promise((resolve, reject) => {
      return (async () => {
        if (!this.isDataSource) {
          const parentBlueprint: TBlueprint = await this.tree.dmssApi
            .blueprintGet({
              typeRef: this.type,
            })
            .then((response: any) => response.data.blueprint)
          this.tree.dmssApi
            .documentGet({
              address: this.nodeId,
              depth: 2,
            })
            .then((response: any) => {
              const data = response.data
              if (data.type === EBlueprint.PACKAGE) {
                this.children = createFolderChildren(data, this)
              } else {
                this.children = createContainedChildren(
                  data,
                  this,
                  parentBlueprint
                )
              }
              this.tree.updateCallback(this.tree)
              resolve('Done')
            })
            .catch((error: Error) => {
              this.type = 'error'
              this.message = error.message
              reject()
            })
        } else {
          // Update content in a datasource. Search the DMSS database for root packages in a given datasource
          // and update the tree if any packages from DMSS is missing in the tree.
          await this.tree.dmssApi
            .search({
              body: { type: EBlueprint.PACKAGE, isRoot: 'true' },
              dataSources: [this.dataSource],
            })
            .then((response: any) => {
              updateRootPackagesInTree(
                response.data,
                this.tree,
                this.dataSource
              )
              resolve('Ok')
            })
            .catch((error: Error) => {
              // If the search fail, set the DataSource as an error node.
              console.error(error)
              this.tree.index[this.dataSource].type = 'error'
              this.tree.index[this.dataSource].message = error.message
              reject()
            })
            .finally(() => {
              this.tree.updateCallback(this.tree)
            })
        }
      })()
    })
  }

  getPath(): string {
    let path = ''
    if (this.parent) {
      path = `${this.parent.getPath()}/`
    }
    return `${path}${this.name}`
  }

  pathFromRootPackage(): string {
    return this.getPath().split('/').splice(1).join('/')
  }

  remove(): void {
    delete this?.parent?.children[this.nodeId]
    this.tree.updateCallback(this.tree)
  }

  // Creates a new entity on DMSS of the given type and saves it to this package,
  // returns the entity's UUID
  async addEntityToPackage(type: string, name: string): Promise<string> {
    if (this.type !== EBlueprint.PACKAGE) {
      throw 'Entities can only be added to package'
    }

    const response = await this.tree.dmssApi.instantiateEntity({
      // @ts-ignore
      entity: { name: name, type: type },
    })
    const newEntity = { ...response.data, name: name }
    const createResponse: AxiosResponse<any> =
      await this.tree.dmssApi.documentAdd({
        address: `${this.nodeId}.content`,
        document: JSON.stringify(newEntity),
        updateUncontained: true,
      })
    await this.expand()
    return createResponse.data.uid
  }
}

export class Tree {
  index: TTreeMap = {}
  dmssApi: DmssAPI
  updateCallback: (t: Tree) => void

  constructor(updateCallback: (t: Tree) => void) {
    this.dmssApi = useDMSS()
    this.updateCallback = updateCallback
  }

  async initFromDataSources(dataSources?: string[]) {
    // Add the dataSources as the top-level nodes
    const allDataSources = await this.dmssApi
      .dataSourceGetAll()
      .then((response) => response.data)
    const validDataSources = dataSources
      ? allDataSources.filter((ds) => dataSources.includes(ds.name))
      : allDataSources
    validDataSources.forEach(
      (ds) =>
        (this.index[ds.id] = new TreeNode(
          this,
          ds.id,
          { name: ds.name, type: 'dataSource' },
          'dataSource',
          undefined,
          ds.name,
          false,
          true
        ))
    )
    const invalidDataSources = dataSources?.filter((ds) =>
      allDataSources.every((x) => x.id !== ds)
    )
    invalidDataSources?.forEach(
      (ds) =>
        (this.index[ds] = new TreeNode(
          this,
          ds,
          { name: ds, type: 'dataSource' },
          'error',
          undefined,
          ds,
          false,
          true,
          {},
          `${ds} does not exist`
        ))
    )
    this.updateCallback(this)
  }

  /**
   * Initialize the Tree view from a given folder.
   *
   * @param folderPath: Define scope for tree view. The folderPath must be on the format: <DataSource>/<rootPackage>/<pathToFolder> and be an address to an entity of type Package.
   *                    The folder specified by folderPath and all subfolders of folderPath will be included, but not anything else.
   */
  async initFromFolder(folderPath: string) {
    const exists = (await this.dmssApi.documentCheck({ address: folderPath }))
      .data
    const data: any = exists
      ? (await this.dmssApi.documentGet({ address: folderPath })).data
      : undefined
    const isEmpty =
      data == undefined || (Array.isArray(data) && data.length == 0)
    let node: TreeNode
    if (isEmpty) {
      node = new TreeNode(
        this,
        folderPath,
        {},
        'error',
        undefined,
        folderPath,
        true,
        false,
        {},
        `${folderPath} ${data == undefined ? 'does not exist' : 'is empty'}`
      )
    } else if (Array.isArray(data)) {
      node = new TreeNode(
        this,
        folderPath,
        data,
        data[0].type,
        undefined,
        folderPath,
        false,
        false
      )
    } else {
      node = new TreeNode(
        this,
        folderPath,
        data,
        data.type,
        undefined,
        data?.name || data._id,
        data?.isRoot ?? false,
        false
      )
    }
    this.index[folderPath] = node
    this.updateCallback(this)
  }

  // "[Symbol.iterator]" is similar to "__next__" in a python class.
  // "*" describes a generator function
  // See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/iterator
  *[Symbol.iterator]() {
    for (const node of Object.values<TreeNode>(this.index)) {
      yield node
    }
  }
}
