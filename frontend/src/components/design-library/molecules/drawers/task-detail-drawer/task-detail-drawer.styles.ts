import { Box, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'

export const ChipRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(0.75)
}))

export const SectionHeading = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  marginBottom: theme.spacing(1),
  marginTop: theme.spacing(2)
}))

export const ActivityList = styled('ul')(({ theme }) => ({
  listStyle: 'none',
  margin: 0,
  padding: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5)
}))

export const ActivityItem = styled('li')(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1.25),
  fontSize: 13
}))

export const Avatar = styled(Box)(({ theme }) => ({
  width: 24,
  height: 24,
  borderRadius: '50%',
  backgroundColor: theme.palette.grey[200],
  color: theme.palette.text.secondary,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 10,
  fontWeight: 600,
  flexShrink: 0
}))

export const ActivityTime = styled('span')(({ theme }) => ({
  display: 'block',
  color: theme.palette.text.disabled,
  fontSize: 11,
  marginTop: 2
}))
