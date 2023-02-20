import {TPlugin, IUIPlugin} from "@development-framework/dm-core";
import React from 'react'
import Editor from "../src/explorer/Editor";
import Header from "./header/Header";


export const plugins: TPlugin[] = [
  {
    pluginName: 'explorer',
    component: Editor
  },
  {
    pluginName: 'header',
    component: Header
  },
  {
    pluginName: ""
  }
]