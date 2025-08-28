import styled from 'styled-components'
import { Button } from '@mui/material'

// Wrapper for each primary action block
export const PrimaryWrapper = styled.div`
  margin-top: 30px;
  margin-bottom: 10px;
`

// Span for the primary button label
export const PrimaryLabel = styled.span`
  display: inline-block;
  margin-right: 10px;
`

// Container for secondary actions row
export const SecondaryContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
`

// Styled MUI Button for secondary actions spacing
export const SecondaryButton = styled(Button)`
  margin-right: 5px;
`

// Span for the secondary button label
export const SecondaryLabel = styled.span`
  display: inline-block;
  margin-right: 10px;
`

// no default export; use named imports
