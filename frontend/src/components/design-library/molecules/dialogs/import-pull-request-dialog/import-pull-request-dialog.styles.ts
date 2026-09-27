import { styled } from '@mui/material/styles'
import { Typography } from '@mui/material'

export const Section = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2.5)
}))

export const FieldLabel = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(0.75),
  fontFamily: 'monospace',
  fontSize: 10.5,
  letterSpacing: '0.09em',
  textTransform: 'uppercase',
  color: theme.palette.text.secondary
}))

export const CommentBox = styled('div')(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.spacing(1),
  overflow: 'hidden'
}))

export const CommentBar = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(1.125, 1.75),
  backgroundColor: theme.palette.action.hover,
  borderBottom: `1px solid ${theme.palette.divider}`,
  fontSize: 13,
  color: theme.palette.text.secondary
}))

export const CommentUser = styled(Typography)(({ theme }) => ({
  fontSize: 13,
  fontWeight: 500,
  color: theme.palette.text.primary
}))

export const CommentMeta = styled(Typography)(() => ({
  fontSize: 13
}))

export const CommentAvatar = styled('span')(({ theme }) => ({
  width: 20,
  height: 20,
  borderRadius: '50%',
  flexShrink: 0,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 10,
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText
}))

export const CommentText = styled('pre')(({ theme }) => ({
  margin: 0,
  padding: theme.spacing(1.75),
  fontFamily: theme.typography.fontFamily,
  fontSize: 14,
  lineHeight: 1.65,
  color: theme.palette.text.primary,
  whiteSpace: 'pre-wrap'
}))

export const CommentTextarea = styled('textarea')(({ theme }) => ({
  display: 'block',
  width: '100%',
  boxSizing: 'border-box',
  minHeight: 126,
  padding: theme.spacing(1.75),
  border: 0,
  outline: 0,
  resize: 'vertical',
  font: 'inherit',
  fontSize: 14,
  lineHeight: 1.65,
  color: theme.palette.text.primary
}))

export const PreviewHead = styled('div')(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 12,
  marginBottom: 8
}))
