import { IBlueprintType, TAttributeType } from './types'

export class Node {
  public attribute: TAttributeType
  public parent: any
  public children: any
  public entity: any
  public concrete: boolean

  constructor(entity: any) {
    this.attribute = {
      name: '',
      type: '',
      attributeType: '',
    }
    this.parent = null
    this.entity = entity
    this.children = []
    this.concrete = false
  }

  addChild(node: Node) {
    node.parent = this
    this.children.push(node)
  }

  primitiveAttributes() {
    return this.entity ? primitiveAttributes(this.entity) : []
  }
}

// Iterate in pre-order depth-first search order (DFS)
export function* dfs(node: Node): any {
  yield node

  if (Array.isArray(node.children)) {
    for (const child of node.children) {
      yield* dfs(child)
    }
  }
}

const isPrimitive = (attribute: TAttributeType) => {
  if (attribute.attributeType) {
    return ['string', 'number', 'integer', 'number', 'boolean'].includes(
      attribute.attributeType
    )
  } else return false
}
const primitiveAttributes = (blueprint: IBlueprintType): TAttributeType[] =>
  blueprint.attributes.filter((attribute: TAttributeType) =>
    isPrimitive(attribute)
  )
const isNonPrimitive = (attribute: TAttributeType) => !isPrimitive(attribute)
const nonPrimitiveAttributes = (blueprint: IBlueprintType): TAttributeType[] =>
  blueprint.attributes.filter((attribute: TAttributeType) =>
    isNonPrimitive(attribute)
  )

export const loader = async (explorer: any, document: any): Promise<Node> => {
  const node = new Node(document)
  await Promise.all(
    nonPrimitiveAttributes(document).map(async (attribute: TAttributeType) => {
      if (!['binary', 'object', 'any'].includes(attribute.attributeType)) {
        const child: IBlueprintType = (
          await explorer.blueprintGet(attribute.attributeType)
        ).data.blueprint
        const childNode: Node = await loader(explorer, child)
        childNode.attribute = attribute
        childNode.entity = child
        node.addChild(childNode)
      }
    })
  )

  return node
}
