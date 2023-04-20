import React, { ChangeEvent } from 'react'
import { useSearch } from '../../hooks/useSearch'
import { Select } from '../Select'
import { useDMSS } from '../../context/DMSSContext'

export const JobHandlerPicker = (props: {
  onChange: (data: string) => void
  formData: string
}) => {
  const { onChange, formData } = props
  const blueprintName = formData.split('/').pop()
  const dmssAPI = useDMSS()
  const [searchResult] = useSearch<any>(
    {
      type: 'dmss://system/SIMOS/Blueprint',
      extends: ['dmss://WorkflowDS/Blueprints/JobHandler'],
    },
    'WorkflowDS'
  )

  const handleChange = (blueprintId: string) => {
    dmssAPI
      .blueprintResolve({
        absoluteId: `WorkflowDS/${blueprintId}`,
      })
      .then((response: any) => {
        onChange(response.data)
      })
      .catch((error: any) => console.error(error))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <Select
        onChange={(e: ChangeEvent<HTMLSelectElement>) => {
          return handleChange(searchResult[parseInt(e.target.value)]._id)
        }}
        value={searchResult.findIndex(
          (resultEntry: any) => resultEntry.name === blueprintName
        )}
      >
        <option value={-1} selected disabled hidden>
          Choose runner...
        </option>
        {searchResult.map((resultEntry: any, index: number) => (
          <option key={index} value={index}>
            {resultEntry.name}
          </option>
        ))}
      </Select>
    </div>
  )
}
