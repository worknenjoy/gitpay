import { styled } from '@mui/material/styles'

export const Who = styled('div')({
  display: 'grid',
  gridTemplateColumns: 'auto minmax(0, 1fr)',
  gap: 10,
  alignItems: 'center',
  '& > span': {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 4
  }
})

export const Name = styled('b')(({ theme }) => ({
  fontSize: 14,
  fontWeight: 500,
  color: theme.palette.text.primary
}))

export const Sub = styled('em')(({ theme }) => ({
  fontStyle: 'normal',
  fontSize: 12.5,
  color: theme.palette.text.secondary
}))
