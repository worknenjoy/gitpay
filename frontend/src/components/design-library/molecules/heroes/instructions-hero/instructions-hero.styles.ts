import { styled } from '@mui/material/styles'
import { Avatar, Typography } from '@mui/material'

export const StepRow = styled('div')(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(3),
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column'
  }
}))

export const StepText = styled('div')(({ theme }) => ({
  flex: 1,
  minWidth: 0
}))

export const StepMedia = styled('div')(({ theme }) => ({
  flex: 1,
  display: 'flex',
  justifyContent: 'center',
  minWidth: 0
}))

export const StepNumberAvatar = styled(Avatar)(({ theme }) => ({
  backgroundColor: theme.palette.primary.light,
  color: theme.palette.primary.main,
  width: 32,
  height: 32,
  fontWeight: 700
}))

export const StepTitleRow = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(1)
}))

export const StepDescription = styled(Typography)(({ theme }) => ({
  lineHeight: 1.6
}))

export const ScreenshotImage = styled('img')(({ theme }) => ({
  maxWidth: '100%',
  height: 'auto',
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[2]
}))
