import React from 'react'
import { Box, Grid, Skeleton } from '@mui/material'
import { StyledContainer } from './project-list-full.styles'
import ProjectCardPlaceholder from 'design-library/molecules/cards/project-card/project-card.placeholder'

type ProjectListFullPlaceholderProps = {
  count?: number
}

const ProjectListFullPlaceholder: React.FC<ProjectListFullPlaceholderProps> = ({ count = 12 }) => {
  const items = Array.from({ length: count }, (_, i) => i)

  return (
    <StyledContainer maxWidth={false}>
      <Box mt={3} mb={3}>
        <Grid container spacing={3}>
          {items.map((i) => (
            <Grid key={i} size={{ lg: 4, md: 6, xs: 12 }}>
              <ProjectCardPlaceholder />
            </Grid>
          ))}
        </Grid>
      </Box>
      <Box mt={3} mb={3} display="flex" justifyContent="center">
        <Skeleton variant="rounded" width={220} height={32} />
      </Box>
    </StyledContainer>
  )
}

export default ProjectListFullPlaceholder
