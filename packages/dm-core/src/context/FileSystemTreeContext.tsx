import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'
import { AuthContext } from 'react-oauth2-code-pkce'
import { Tree, TreeNode } from '../domain/Tree'

export const FSTreeContext = createContext<{
  tree: null | Tree
  treeNodes: TreeNode[]
  loading: boolean
}>({
  tree: null,
  treeNodes: [],
  loading: false,
})

export const FSTreeProvider = (props: {
  children: ReactNode
  visibleDataSources: string[]
}) => {
  const { children, visibleDataSources } = props
  const { token } = useContext(AuthContext)
  const [loading, setLoading] = useState<boolean>(true)
  const [treeNodes, setTreeNodes] = useState<TreeNode[]>([])
  //@ts-ignore
  const tree: Tree = new Tree(token, (t: Tree) => setTreeNodes([...t]))

  useEffect(() => {
    setLoading(true)
    tree
      .initFromDataSources(visibleDataSources)
      .finally(() => setLoading(false))
  }, [])

  return (
    <FSTreeContext.Provider value={{ tree, treeNodes, loading }}>
      {children}
    </FSTreeContext.Provider>
  )
}
