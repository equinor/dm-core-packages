import type { ChangeEvent } from 'react'
import { useSearch } from '../../hooks/useSearch'
import { Select } from '../Select'

export const EntityPickerDropdown = (props: {
  onChange: (data: any) => void
  typeFilter: string
  dataSourceId: string
  formData: any
}) => {
  const { onChange, typeFilter, formData, dataSourceId } = props
  const [searchResult] = useSearch<any>({ type: typeFilter }, [dataSourceId])

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <Select
        onChange={(e: ChangeEvent<HTMLSelectElement>) =>
          onChange({ ...searchResult[Number.parseInt(e.target.value)] })
        }
        value={searchResult.findIndex(
          (resultEntry: any) => resultEntry._id === formData._id
        )}
      >
        {searchResult.map((resultEntry: any, index: number) => (
          <option key={index} value={index}>
            {resultEntry.name}
          </option>
        ))}
      </Select>
    </div>
  )
}
