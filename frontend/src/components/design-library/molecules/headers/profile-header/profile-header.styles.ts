import { Avatar } from '@mui/material'
import { styled } from '@mui/material/styles'

export const Root = styled('div')(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(1.5, 3.5, 2.5),
  borderBottom: `1px solid ${theme.palette.divider}`
}))

export const ShareRow = styled('div')({
  display: 'flex',
  justifyContent: 'flex-end',
  marginBottom: 4
})

export const AvatarWrap = styled('div')({
  position: 'relative',
  display: 'inline-flex',
  marginBottom: 10
})

export const BigAvatar = styled(Avatar)(({ theme }) => ({
  width: 72,
  height: 72,
  fontSize: 22,
  fontFamily: 'monospace',
  fontWeight: 500,
  backgroundColor: theme.palette.action.hover,
  color: theme.palette.text.secondary,
  border: `1px solid ${theme.palette.divider}`
}))

export const VerifiedBadgeSlot = styled('span')({
  position: 'absolute',
  bottom: 2,
  right: 2
})

export const Block = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '8px 0'
})

export const LinksRow = styled('div')({
  display: 'flex',
  gap: 8,
  flexWrap: 'wrap',
  justifyContent: 'center',
  marginTop: 4
})

export const CtaRow = styled('div')({
  display: 'inline-flex',
  gap: 10,
  marginTop: 12
})

export const MetaLine = styled('div')({
  display: 'inline-flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 10,
  maxWidth: 560
})

export const MetaSeparator = styled('span')(({ theme }) => ({
  width: 3,
  height: 3,
  borderRadius: '50%',
  backgroundColor: theme.palette.text.secondary,
  display: 'inline-block'
}))

export const MetaBlock = styled('div')({
  marginTop: 10,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 10
})
