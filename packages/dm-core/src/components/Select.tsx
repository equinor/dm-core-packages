import styled from 'styled-components'
import { INPUT_FIELD_WIDTH } from '../utils/variables'

export const Select = styled.select<{ width?: string }>`
  position: relative;
  font-size: medium;
  padding: 6px 8px;
  border: 0;
  border-bottom: 1px solid rgba(111, 111, 111, 1);
  cursor: pointer;
  height: 36px;
  background-color: #f7f7f7;
  width: ${(props) => (props.width ? props.width : INPUT_FIELD_WIDTH)};
`
