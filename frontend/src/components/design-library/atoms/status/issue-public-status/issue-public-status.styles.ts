import styled from 'styled-components'
import { Chip } from '@mui/material'
import { Lock as PrivateIcon, LockOpen as PublicIcon } from '@mui/icons-material'

// Styled MUI Chip with spacing and vertical alignment
export const StyledChip = styled(Chip)`
  margin-left: 12px;
  margin-right: 12px;
  vertical-align: middle;
`

// Icons with the required size and alignment
export const PrivateIconStyled = styled(PrivateIcon)`
  font-size: 14px !important;
  vertical-align: middle;
`

export const PublicIconStyled = styled(PublicIcon)`
  font-size: 14px !important;
  vertical-align: middle;
`

// no default export; use named imports
