import { Box, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'

export const Section = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  '&:first-of-type': {
    marginTop: theme.spacing(0.5)
  }
}))

export const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  marginBottom: theme.spacing(1),
  color: theme.palette.text.primary
}))

export const DefinitionList = styled('dl')(({ theme }) => ({
  margin: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1)
}))

export const DefinitionRow = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: 12
}))

export const DefinitionLabel = styled('dt')(({ theme }) => ({
  margin: 0,
  color: theme.palette.text.secondary,
  fontSize: theme.typography.body2.fontSize,
  lineHeight: 1.5,
  flex: '1 1 0',
  minWidth: 0,
  paddingRight: theme.spacing(1)
}))

export const DefinitionValue = styled('dd')(({ theme }) => ({
  margin: 0,
  color: theme.palette.text.primary,
  fontSize: theme.typography.body2.fontSize,
  lineHeight: 1.5,
  textAlign: 'right',
  flex: '0 0 auto',
  maxWidth: '55%',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis'
}))

export const Divider = styled(Box)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  marginTop: theme.spacing(2)
}))
