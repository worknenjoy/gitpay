import React from 'react'
import { Root, Item } from './project-list-compact.styles'
import ProjectCardPlaceholder from 'design-library/molecules/cards/project-card/project-card.placeholder'

const ProjectListCompactPlaceholder = () => {
  return (
    <Root>
      {Array.from(new Array(3)).map((_, index) => (
        <Item key={index}>
          <ProjectCardPlaceholder />
        </Item>
      ))}
    </Root>
  )
}

export default ProjectListCompactPlaceholder
