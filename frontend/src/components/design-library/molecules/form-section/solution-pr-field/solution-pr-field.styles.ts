import { styled } from '@mui/material/styles'
import { Input as MuiInput } from '@mui/material'

export const Field = styled('div')(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  display: 'flex',
  flexDirection: 'column',
  gap: 6
}))

export const Label = styled('span')(({ theme }) => ({
  fontSize: 13,
  fontWeight: 500,
  color: theme.palette.text.primary
}))

export const InputBox = styled('div')(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: 8,
  padding: '4px 6px 4px 12px',
  '&:focus-within': {
    borderColor: theme.palette.primary.main
  }
}))

export const Input = styled(MuiInput)({
  fontSize: 14,
  '& input': { padding: '8px 0' }
})

export const PickerButton = styled('button')(({ theme }) => ({
  font: 'inherit',
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  height: 32,
  padding: '0 10px',
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: 6,
  background: theme.palette.background.paper,
  fontSize: 13,
  fontWeight: 500,
  color: theme.palette.text.primary,
  whiteSpace: 'nowrap',
  cursor: 'pointer',
  '& img': { width: 16, height: 16 },
  '&:hover, &[aria-expanded="true"]': {
    borderColor: theme.palette.primary.main
  }
}))

export const Hint = styled('span')(({ theme }) => ({
  fontSize: 12.5,
  color: theme.palette.text.secondary,
  '& b': { fontWeight: 500, color: theme.palette.text.primary }
}))

export const RowText = styled('span')({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minWidth: 0
})

export const RowTitle = styled('b')(({ theme }) => ({
  fontSize: 14,
  fontWeight: 500,
  color: theme.palette.text.primary,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis'
}))

export const RowMeta = styled('span')(({ theme }) => ({
  fontSize: 12.5,
  color: theme.palette.text.secondary
}))
