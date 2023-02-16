import * as React from 'react'
import { TabsContainer } from './tabs/TabsContainer'
import { EditBlueprint } from './blueprint/EditBlueprint'
import PDFViewer from './pdf/PDFViewer'

import { TPlugin } from '@development-framework/dm-core'

import Editor from './explorer/Editor'
import Header from './header/Header'
import JobInputEdit from './job/JobInputEdit'
import JobControl from './job/JobControl'
import YamlPlugin from './yaml-view/YamlPlugin'
import Mermaid from './mermaid/Mermaid'
import JSONView from './json-view/JSONView'
import Form from './form/FormPlugin'

export const plugins: TPlugin[] = [
  {
    pluginName: 'tabs',
    component: TabsContainer,
  },
  {
    pluginName: 'edit-blueprint',
    component: EditBlueprint,
  },
  {
    pluginName: 'pdf',
    component: PDFViewer,
  },
  {
    pluginName: 'json-view',
    component: JSONView,
  },
  {
    pluginName: 'explorer',
    component: Editor,
  },
  {
    pluginName: 'form',
    component: Form,
  },
  {
    pluginName: 'header',
    component: Header,
  },
  {
    pluginName: 'jobControl',
    component: JobControl,
  },
  {
    pluginName: 'jobInputEdit',
    component: JobInputEdit,
  },
  {
    pluginName: 'mermaid',
    component: Mermaid,
  },
  {
    pluginName: 'yaml-view',
    component: YamlPlugin,
  },
]
