import { Input, Typography } from '@equinor/eds-core-react'
import styled from 'styled-components'

/** The "Website builder" title doubles as a back link to the site directory. */
export const BackButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
`

export const BackTitle = styled(Typography)`
  text-decoration: underline;
  text-decoration-style: dotted;
  text-underline-offset: 3px;
`

export const SiteNameInput = styled(Input)`
  width: 12rem;
`

/** Compact readout of the current grid density (columns × rows). */
export const DensityReadout = styled.span`
  font-size: 13px;
  min-width: 56px;
  text-align: center;
`
