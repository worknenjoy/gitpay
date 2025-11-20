import { styled } from '@mui/material/styles'
import { Card, Container } from '@mui/material'
import ProjectCard from '../../../cards/project-card/project-card'

export const Root = styled('div')(({ theme }) => ({
  marginTop: theme.spacing(0),
  marginBottom: theme.spacing(2),
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'flex-start'
}))

export const RootCard = styled(Card)(({ theme }) => ({
  maxWidth: 345,
  marginRight: 20
}))

export const Item = styled('div')(({ theme }) => ({
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(3),
  marginRight: theme.spacing(3)
}))

export const StyledContainer = styled(Container)(({ theme }) => ({
  backgroundColor: (theme as any).palette?.background?.dark,
  minHeight: '100%',
  paddingBottom: theme.spacing(3),
  paddingTop: theme.spacing(3)
}))

export const StyledProjectCard = styled(ProjectCard as any)({
  height: '100%'
})
