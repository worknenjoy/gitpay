import styled from 'styled-components'
import { Button } from '@mui/material'

// Wrapper for each primary action block
export const PrimaryWrapper = styled.div`
  margin-bottom: 20px;
`

// Span for the primary button label
export const PrimaryLabel = styled.span`
  display: inline-block;
  margin-right: 10px;
`

// Container for secondary actions row
export const SecondaryContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  margin-top: 20px;
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
