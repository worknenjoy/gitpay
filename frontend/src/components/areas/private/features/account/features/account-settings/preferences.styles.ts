import { styled } from '@mui/material/styles'
import { Paper, Typography, Grid } from '@mui/material'

export const Root = styled(Paper)(({ theme }) => ({
  padding: 20
}))

export const Title = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2)
}))

export const ChipContainer = styled('div')(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(1),
  marginTop: theme.spacing(1),
  marginLeft: 0,
  paddingLeft: 0,
  [theme.breakpoints.down('sm')]: {
    marginTop: theme.spacing(2),
    flexDirection: 'column',
    gap: theme.spacing(1)
  }
}))

export const InlineLabel = styled(Typography)(({ theme }) => ({
  display: 'inline-block'
}))

export const SkillsGrid = styled(Grid)(({ theme }) => ({
  marginBottom: 10
}))

export const Section = styled('div')(({ theme }) => ({
  width: '100%',
  flex: 'auto',
  display: 'flex',
  marginTop: 20
}))

export const SectionContent = styled(Grid)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    marginTop: theme.spacing(2),
    flexDirection: 'column',
  }
}))
