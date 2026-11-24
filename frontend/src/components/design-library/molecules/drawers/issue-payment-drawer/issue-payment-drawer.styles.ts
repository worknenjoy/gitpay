import { styled, alpha } from '@mui/material/styles'
import { TextField } from '@mui/material'

export const Section = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
  marginTop: 20
})

export const SectionLabel = styled('span')(({ theme }) => ({
  fontSize: 13,
  fontWeight: 500,
  color: theme.palette.text.primary
}))

export const Amounts = styled('div')({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: 12
})

export const Pills = styled('div')({
  display: 'flex',
  flexWrap: 'wrap',
  gap: 6
})

export const Pill = styled('button')(({ theme }) => ({
  font: 'inherit',
  height: 32,
  padding: '0 14px',
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: 16,
  background: theme.palette.background.paper,
  fontSize: 13,
  fontWeight: 500,
  color: theme.palette.text.primary,
  cursor: 'pointer',
  '&:hover': { borderColor: theme.palette.primary.main },
  '&[data-on="true"]': {
    borderColor: theme.palette.primary.main,
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
    color: theme.palette.primary.main
  }
}))

export const AmountInput = styled(TextField)({
  width: 170
})

export const FeeLine = styled('span')(({ theme }) => ({
  fontSize: 12.5,
  color: theme.palette.text.secondary,
  '& b': { fontWeight: 500, color: theme.palette.text.primary }
}))

export const Methods = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  gap: 8,
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: '1fr'
  }
}))

export const Radio = styled('span')(({ theme }) => ({
  width: 18,
  height: 18,
  marginTop: 1,
  borderRadius: '50%',
  border: `2px solid ${theme.palette.grey[400]}`,
  boxSizing: 'border-box'
}))

export const Method = styled('button')(({ theme }) => ({
  font: 'inherit',
  display: 'grid',
  gridTemplateColumns: '18px minmax(0, 1fr)',
  gap: 10,
  alignItems: 'start',
  padding: 12,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: 8,
  background: theme.palette.background.paper,
  textAlign: 'left',
  cursor: 'pointer',
  '&:hover': { borderColor: theme.palette.grey[500] },
  '&[data-on="true"]': {
    borderColor: theme.palette.primary.main,
    boxShadow: `0 0 0 1px ${theme.palette.primary.main} inset`
  },
  '&[data-on="true"] > span:first-of-type': {
    border: `5px solid ${theme.palette.primary.main}`
  }
}))

export const MethodText = styled('span')(({ theme }) => ({
  '& b': { display: 'block', fontSize: 14, fontWeight: 500, color: theme.palette.text.primary },
  '& em': {
    display: 'block',
    fontStyle: 'normal',
    fontSize: 12,
    lineHeight: 1.45,
    marginTop: 2,
    color: theme.palette.text.secondary
  }
}))

export const Note = styled('p')(({ theme }) => ({
  display: 'flex',
  gap: 8,
  alignItems: 'flex-start',
  margin: '20px 0 0',
  fontSize: 12.5,
  lineHeight: 1.5,
  color: theme.palette.text.secondary,
  '& svg': { fontSize: 14, marginTop: 2, flexShrink: 0 }
}))
