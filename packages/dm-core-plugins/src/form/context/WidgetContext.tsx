import React, { createContext, useContext } from 'react'
import { TWidgets } from '../types'
import defaultWidgets from '../widgets'

const WidgetContext = createContext<TWidgets | undefined>(undefined)

/**
 * This function can be used to select a widget among default and custom widgets.
 * Note that it will only work for custom widgets if it's used in combination with the WidgetProvider
 */
export const getWidget = (widgetName: string) => {
  const context = useContext(WidgetContext)
  let widgets = { ...defaultWidgets }
  if (context) {
    widgets = { ...defaultWidgets, ...context }
  }

  const name = widgetName.trim()
  if (!(name in widgets)) {
    throw Error(`Could not find widget ${name}.`)
  }
  return widgets[name]
}

/**
 * This provider is useful if you want to use custom widgets not provided by the form plugin
 */
export const WidgetProvider = (props: {
  widgets?: TWidgets
  children: React.ReactElement | React.ReactElement[]
}) => {
  const { widgets, children } = props
  return (
    <WidgetContext.Provider value={widgets}>{children}</WidgetContext.Provider>
  )
}
