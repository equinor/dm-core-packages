import { TWidget } from '../types'
import CheckboxWidget from './CheckboxWidget'
import TextWidget from './TextWidget'
import TextareaWidget from './TextareaWidget'

const widgets: {
  [key: string]: (props: TWidget) => JSX.Element
} = {
  CheckboxWidget,
  TextWidget,
  TextareaWidget,
}

export default widgets
