import { Icon } from '@equinor/eds-core-react'
import { miniplayer } from '@equinor/eds-icons'
import {
  FaDatabase,
  FaExclamationTriangle,
  FaFileArchive,
  FaFileImage,
  FaFilePdf,
  FaFolder,
  FaFolderOpen,
  FaLink,
  FaList,
  FaRegFileAlt,
} from 'react-icons/fa'
import { EBlueprint } from '../../../Enums'
import type { TreeNode } from '../../../domain/Tree'

export const TypeIcon = (props: { node: TreeNode; expanded: boolean }) => {
  const { node, expanded } = props

  if (node.type === 'error')
    return (
      <FaExclamationTriangle
        style={{ color: 'orange' }}
        title='failed to load'
      />
    )

  const showAsReference =
    node.parent?.type !== EBlueprint.PACKAGE &&
    node?.type !== EBlueprint.PACKAGE &&
    node?.type !== 'dataSource' &&
    !Array.isArray(node?.entity) && // Lists can not be uncontained
    !node?.attribute?.contained &&
    !node?.parent?.attribute?.contained // For items in a list we need to check the parent

  if (showAsReference) {
    return <FaLink style={{ color: '#2966FF' }} title='blueprint' />
  }

  if (Array.isArray(node.entity)) {
    return <FaList title='list' />
  }
  if (Array.isArray(node?.parent?.entity)) {
    return <span>{'{}'}</span>
  }
  switch (node.type) {
    case EBlueprint.FILE: {
      const fileColor = '#2965FF'
      if (node.entity['filetype'] === 'application/pdf')
        return <FaFilePdf style={{ color: fileColor }} title='pdf' />
      if (node.entity['filetype'].startsWith('image'))
        return <FaFileImage style={{ color: fileColor }} title='image' />
      return <FaFileArchive style={{ color: fileColor }} title='zip' />
    }
    case 'dataSource':
      return <FaDatabase style={{ color: 'gray' }} title='data source' />
    case EBlueprint.BLUEPRINT:
      return <FaRegFileAlt style={{ color: '#2966FF' }} title='blueprint' />
    case EBlueprint.RECIPE_LINK:
      return <Icon data={miniplayer} size={18} />
    case EBlueprint.PACKAGE:
      if (expanded) {
        if (node.isRoot) {
          return (
            <FaFolderOpen style={{ color: '#8531A3' }} title='root package' />
          )
        } else {
          return <FaFolderOpen title='package' />
        }
      } else {
        if (node.isRoot) {
          return <FaFolder style={{ color: '#8531A3' }} title='root package' />
        } else {
          return <FaFolder title='package' />
        }
      }
    default:
      return <FaRegFileAlt title='file' />
  }
}
