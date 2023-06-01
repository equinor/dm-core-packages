import React from 'react'
import {
  IUIPlugin,
  Loading,
  useDocument,
  TGenericObject,
} from '@development-framework/dm-core'
import Plot from 'react-plotly.js'

const ESSPlotPlugin = (props: { document: TGenericObject }) => {
  const { document } = props

  console.log(document)

  const yData = document.value
  const xData: number[] = []

  if (Array.isArray(document.value)) {
    for (let i = 0; i < document.value.length; i++) {
      xData.push(document.xstart + i * document.xdelta)
    }
  }

  const xLabel: string = `${document.xlabel || document.xname}${
    document.xunit ? ` [${document.xunit}]` : ''
  }`
  const yLabel: string = `${document.label || document.name}${
    document.unit ? ` [${document.unit}]` : ''
  }`

  return (
    <Plot
      data={[
        {
          x: xData,
          y: yData,
          type: 'scatter',
          mode: 'lines',
          marker: { color: 'red' },
        },
      ]}
      layout={{
        width: 620,
        height: 440,
        title: document.name,
        xaxis: {
          title: xLabel,
          showgrid: true,
          zeroline: true,
        },
        yaxis: {
          title: yLabel,
          showgrid: true,
          zeroline: true,
        },
      }}
    />
  )
}

const SignalPlot_Component = (props: IUIPlugin) => {
  const { idReference } = props
  const [document, loading, updateDocument, error] =
    useDocument<TGenericObject>(idReference, 999)

  if (loading) return <Loading />
  if (error) {
    throw new Error(JSON.stringify(error))
  }

  return <ESSPlotPlugin document={document || {}} />
}

export { SignalPlot_Component as SignalPlot }
