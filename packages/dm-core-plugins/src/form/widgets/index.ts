import { TWidget } from '../types'
import BlueprintPickerWidget from './BlueprintPickerWidget'
import CheckboxWidget from './CheckboxWidget'
import TextWidget from './TextWidget'
import TextareaWidget from './TextareaWidget'
import TypeWidget from './TypeWidget'

const widgets: {
  [key: string]: (props: TWidget) => JSX.Element
} = {
  CheckboxWidget,
  TextWidget,
  TextareaWidget,
  BlueprintPickerWidget,
  TypeWidget,
}

export default widgets
