import { styled } from '@mui/material/styles'
import { Typography } from '@mui/material'

export const DescriptionHeading = styled(Typography)(({ theme }) => ({
  marginBottom: 10,
  marginTop: 20,
}))

export const IssueContentText = styled(Typography)(({ theme }) => ({
  marginBottom: 40,
  wordBreak: 'break-word',
  overflowWrap: 'break-word',
  '& a': {
    wordBreak: 'break-all',
  },
  '& img': {
    maxWidth: '100%',
    height: 'auto',
  },
}))
