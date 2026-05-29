import { Alert, Box, styled } from '@mui/material'

export const AlertStyled = styled(Alert)(({ theme }) => ({
  width: '100%',
  alignItems: 'center',
  border: `1px solid ${theme.palette.grey[500]}`,
  boxShadow: 'none'
}))

export const StickyAlertWrapper = styled(Box)(({ theme }) => ({
  position: 'sticky',
  top: 0,
  zIndex: theme.zIndex.appBar,
  width: '100%',
}))
