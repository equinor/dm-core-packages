import { TWidgets } from '../types'
import BlueprintPickerWidget from './BlueprintPickerWidget'
import CheckboxWidget from './CheckboxWidget'
import DateTimeWidget from './DateTimeWidget'
import DimensionalScalarWidget from './DimensionalScalarWidget'
import EntityPickerWidget from './EntityPickerWidget'
import NumberWidget from './NumberWidget'
import SelectWidget from './SelectWidget'
import SwitchWidget from './SwitchWidget'
import TextWidget from './TextWidget'
import TextareaWidget from './TextareaWidget'
import TypeWidget from './TypeWidget'

const widgets: TWidgets = {
  CheckboxWidget,
  TextWidget,
  TextareaWidget,
  BlueprintPickerWidget,
  TypeWidget,
  SwitchWidget,
  SelectWidget,
  NumberWidget,
  DateTimeWidget,
  DimensionalScalarWidget,
  EntityPickerWidget,
}

export default widgets
