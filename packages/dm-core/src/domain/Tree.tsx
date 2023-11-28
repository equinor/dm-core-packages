import { AxiosResponse } from 'axios'
import { splitAddress } from '../utils/addressUtilities'
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
    const PRIMITIVE_TYPES_TO_HIDE = [
      'string',
      'number',
      'boolean',
      'integer',
      'binary',
    ]
    if (!PRIMITIVE_TYPES_TO_HIDE.includes(type)) {
      let childNodeId: string
      if (Number.isInteger(Number(key))) {
        // For arrays, bracket syntax is used to construct the node id: [key]
        childNodeId = `${parentNode.nodeId}[${key}]`
      } else {
        childNodeId = `${parentNode.nodeId}.${key}`
      }
      newChildren[childNodeId] = new TreeNode({
        tree: parentNode.tree,
        nodeId: childNodeId,
        entity: value,
        type,
        parent: parentNode,
        name: Array.isArray(document) ? value?.name || key : key,
        children: parentNode.children?.[childNodeId]?.children || {},
        attribute: blueprint.attributes?.find(
          (attribute: TAttribute) => attribute.name == key
        ),
      })
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
    const newChildId = `dmss://${parentNode.dataSource}/$${resolvedChild?._id}`
    newChildren[newChildId] = new TreeNode({
      tree: parentNode.tree,
      nodeId: newChildId,
      entity: resolvedChild,
      type: resolvedChild.type,
      parent: parentNode,
      name: resolvedChild.name,
      children: parentNode.children?.[newChildId]?.children || {},
    })
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
      const rootPackageNode = new TreeNode({
        // Add the rootPackage nodes to the dataSource
        tree,
        nodeId: `dmss://${dataSource}/$${rootPackage._id}`,
        entity: rootPackage,
        type: EBlueprint.PACKAGE,
        parent: tree.index[dataSource],
        name: rootPackage.name,
        isRoot: true,
      })
      tree.index[dataSource].children[rootPackage._id ?? ''] = rootPackageNode
    }
  })
}

export class TreeNode {
  tree: Tree
  type: string
  nodeId: string
  dataSource: string
  children: TTreeMap
  parent: TreeNode | undefined
  isRoot: boolean
  isDataSource: boolean
  entity: any
  name: string | undefined
  message: string
  attribute: TAttribute | undefined

  constructor({
    tree,
    nodeId,
    entity,
    type,
    parent = undefined,
    name = undefined,
    isRoot = false,
    isDataSource = false,
    children = {},
    message = '',
    attribute = undefined,
  }: {
    tree: Tree
    nodeId: string
    entity: any
    type: string
    parent?: TreeNode
    name?: string
    isRoot?: boolean
    isDataSource?: boolean
    children?: TTreeMap
    message?: string
    attribute?: TAttribute
  }) {
    this.tree = tree
    this.nodeId = nodeId
    this.dataSource = nodeId.replace(/^(dmss:\/\/)/, '').split('/', 1)[0]
    this.parent = parent
    this.isRoot = isRoot
    this.isDataSource = isDataSource
    this.entity = entity
    this.name = name
    this.type = type
    this.children = children
    this.message = message
    this.attribute = attribute
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

  // Creates a new entity in DMSS of the given type and saves it to this target,
  // returns the entity's UUID
  async appendEntity(type: string, name: string): Promise<string> {
    const response = await this.tree.dmssApi.instantiateEntity({
      // @ts-ignore
      entity: { name: name, type: type },
    })
    const targetAddress =
      this.type === EBlueprint.PACKAGE ? `${this.nodeId}.content` : this.nodeId
    const newEntity = { ...response.data, name: name }
    const createResponse: AxiosResponse<any> =
      await this.tree.dmssApi.documentAdd({
        address: targetAddress,
        document: JSON.stringify(newEntity),
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

  async init(path?: string[]) {
    if (!path) {
      this.initFromDataSources()
      return
    }
    path
      .filter((x) => splitAddress(x).documentPath)
      .forEach((x) => this.initFromPath(x))
    const dataSources = path.filter((x) => !splitAddress(x).documentPath)
    if (dataSources.length) this.initFromDataSources(dataSources)
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
        (this.index[ds.id] = new TreeNode({
          tree: this,
          nodeId: ds.id,
          entity: { name: ds.name, type: 'dataSource' },
          type: 'dataSource',
          name: ds.name,
          isDataSource: true,
        }))
    )
    const invalidDataSources = dataSources?.filter((ds) =>
      allDataSources.every((x) => x.id !== ds)
    )
    invalidDataSources?.forEach(
      (ds) =>
        (this.index[ds] = new TreeNode({
          tree: this,
          nodeId: ds,
          entity: { name: ds, type: 'dataSource' },
          type: 'error',
          name: ds,
          isDataSource: true,
          message: `${ds} does not exist`,
        }))
    )
    this.updateCallback(this)
  }

  /**
   * Initialize the Tree view from a given path.
   *
   * @param path: Define scope for tree view. The path can point to either a package, a document or a complex attribute.
   *
   * The object specified by path and all subfolders of path will be included, but not anything else.
   */
  async initFromPath(path: string) {
    const exists = (await this.dmssApi.documentCheck({ address: path })).data
    const data: any = exists
      ? (await this.dmssApi.documentGet({ address: path })).data
      : undefined
    const isEmpty =
      data == undefined || (Array.isArray(data) && data.length == 0)
    let node: TreeNode
    if (isEmpty) {
      node = new TreeNode({
        tree: this,
        nodeId: path,
        entity: {},
        type: 'error',
        name: path,
        message: `${path} ${data == undefined ? 'does not exist' : 'is empty'}`,
      })
    } else if (Array.isArray(data)) {
      node = new TreeNode({
        tree: this,
        nodeId: path,
        entity: data,
        type: data[0].type,
        name: path,
      })
    } else {
      node = new TreeNode({
        tree: this,
        nodeId: path,
        entity: data,
        type: data.type,
        name: data?.name || data._id,
        isRoot: data?.isRoot ?? false,
      })
    }
    this.index[path] = node
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
