import {
  useApplication,
  useDMSS,
  useSearch,
} from '@development-framework/dm-core'
import { EdsProvider, Menu } from '@equinor/eds-core-react'
import { add } from '@equinor/eds-icons'
import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import TooltipButton from '../../common/TooltipButton'
import { useRegistryContext } from '../context/RegistryContext'

type Hit = { dataSource: string; id: string; label: string }

const AddObjectBySearchButton = (props: {
  type: string
  namePath: string
  onAdd?: () => void
}) => {
  const { type, namePath, onAdd } = props
  const { setValue } = useFormContext()
  const dmssAPI = useDMSS()
  const { idReference } = useRegistryContext()
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const application = useApplication()
  const [searchResult] = useSearch<any>(
    {
      type: 'dmss://system/SIMOS/Blueprint',
      extends: [type],
    },
    application.dataSources
  )

  const openMenu = () => {
    setIsOpen(true)
  }
  const closeMenu = () => {
    setIsOpen(false)
  }

  const addDocument = (address: string) => {
    dmssAPI
      .blueprintResolve({
        address: address,
      })
      .then(async (resolveBlueprintResponse) => {
        const instantiateEntityResponse = await dmssAPI.instantiateEntity({
          entity: { type: resolveBlueprintResponse?.data },
        })
        const newEntity = instantiateEntityResponse.data
        await dmssAPI.documentAdd({
          address: `${idReference}.${namePath}`,
          document: JSON.stringify(newEntity),
        })
        const options = {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true,
        }
        setValue(namePath, newEntity, options)
        onAdd && onAdd()
      })
      .catch((error) => console.error(error))
  }

  const hits: Hit[] = []
  for (const hit in searchResult) {
    hits.push({
      dataSource: hit.split('/')[0],
      id: searchResult[hit]._id,
      label: searchResult[hit].name,
    })
  }

  return (
    <EdsProvider density='compact'>
      <TooltipButton
        button-ref={setAnchorEl}
        button-aria-haspopup='true'
        button-aria-expanded={isOpen}
        iconSize={18}
        button-aria-controls='menu-match'
        title='Add'
        button-variant='ghost_icon'
        button-onClick={() => (isOpen ? closeMenu() : openMenu())}
        icon={add}
      />
      <Menu
        open={isOpen}
        id='menu-match'
        aria-labelledby='anchor-match'
        onClose={closeMenu}
        anchorEl={anchorEl}
        matchAnchorWidth
      >
        {hits.map((hit) => {
          return (
            <Menu.Item
              key={hit.id}
              onClick={() => addDocument(`${hit.dataSource}/$${hit.id}`)}
            >
              {hit.label}
            </Menu.Item>
          )
        })}
      </Menu>
    </EdsProvider>
  )
}

export default AddObjectBySearchButton
