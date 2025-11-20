import { styled } from '@mui/material/styles'
import { Container } from '@mui/material'
import ProjectCard from '../../../cards/project-card/project-card'

export const StyledContainer = styled(Container)(({ theme }) => ({
  backgroundColor: (theme as any).palette?.background?.dark,
  minHeight: '100%',
  paddingBottom: theme.spacing(3),
  paddingTop: theme.spacing(3)
}))

export const StyledProjectCard = styled(ProjectCard as any)({
  height: '100%'
})
