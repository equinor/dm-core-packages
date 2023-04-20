import React, { createContext, ReactNode, useEffect, useState } from 'react'
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
  const [loading, setLoading] = useState<boolean>(true)
  const [treeNodes, setTreeNodes] = useState<TreeNode[]>([])
  const tree: Tree = new Tree((t: Tree) => setTreeNodes([...t]))

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
