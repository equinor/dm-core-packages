//import React, {useEffect, useState} from 'react'
import React, { ChangeEvent, useEffect, useState } from 'react'

import {
  BlueprintPicker,
  IUIPlugin,
  INPUT_FIELD_WIDTH,
  Loading,
  Select,
  truncatePathString,
  useDocument,
  TBlueprint,
  TGenericObject
} from '@development-framework/dm-core'

import {
  Accordion,
  Button,
  Icon,
  Label,
  Switch,
  TextField,
} from '@equinor/eds-core-react'

import Plot from "react-plotly.js";

const ESSPlotPlugin = (props: { document: TGenericObject }) => {
  const { document } = props

  console.log(document)


  type  Line = { x?:  number[];
                 y?:  number[];
                 xlabel?: string;
                 ylabel?: string; }

  const line: Line = {};

  line['x'] = [0]
  line['y'] = [0]

  if (Array.isArray(document.value)) {
    line['y'] = document.value
    line['x'] = []
    for (let i = 0; i < document.value.length; i++) {
      line.x.push(document.xstart + i * document.xdelta)
    }
  }

  let xlabel = document.xname
  let ylabel = document.name
  let xunit = ''
  let yunit = ''

  if (document.xlabel != '') xlabel = document.xlabel
  if (document.label != '') ylabel = document.label

  if (document.xunit != '') xunit = '[' + document.xunit + ']'
  if (document.unit != '') yunit = '[' + document.unit + ']'

  line['xlabel'] = xlabel + ' ' + xunit
  line['ylabel'] = ylabel + ' ' + yunit

  console.log(line)

  return (
    <Plot
      data={[
        {
          x: line.x,
          y: line.y,
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
          title: line.xlabel,
          showgrid: true,
          zeroline: true,
        },
        yaxis: {
          title: line.ylabel,
          showgrid: true,
          zeroline: true,
        },
      }}
    />
  )
}

const SignalPlot_Component = (props: IUIPlugin) => {
  const { idReference } = props
  const [
    document,
    loading,
    updateDocument,
    error,
  ] = useDocument<TGenericObject>(idReference, 999)

  if (loading) return <Loading />
  if (error) {
    throw new Error(JSON.stringify(error))
  }

  // return <SignalPlot document={document} />

  return <ESSPlotPlugin document={document || {}} />

}

export { SignalPlot_Component as SignalPlot }

