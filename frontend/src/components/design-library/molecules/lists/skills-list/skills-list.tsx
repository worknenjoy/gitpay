import React from 'react'
import { Box } from '@mui/material'
import TagChip from 'design-library/atoms/badges/tag-chip/tag-chip'

export type SkillsListProps = {
  skills: string[]
}

const SkillsList = ({ skills }: SkillsListProps) => (
  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
    {skills.map((skill) => (
      <TagChip key={skill} label={skill} variant="neutral" />
    ))}
  </Box>
)

export default SkillsList
