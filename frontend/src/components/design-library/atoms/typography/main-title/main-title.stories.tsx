import React from 'react'
import { Typography } from '@mui/material'
import Title from './main-title'
import RolePill from '../../badges/role-pill/role-pill'

const meta = {
  title: 'Design Library/Atoms/Typography/Titles/MainTitle',
  component: Title,
  args: {
    title: 'Sample Title',
    subtitle: 'This is a subtitle'
  },
  argTypes: {
    level: {
      control: { type: 'number', min: 1, max: 6 },
      description: 'Heading level (1-6)'
    },
    children: {
      control: 'text',
      description: 'Title text'
    }
  }
}

export default meta

export const Default = {
  args: {
    title: 'Default Title',
    subtitle: 'This is a default subtitle'
  }
}

// Preview only — MainTitle/BaseTitle do not accept a node next to the title yet.
// This mocks the layout an optional prop would give us (title + role badge in
// one row, subtitle below), matching the Dashboard v2 design's title/badge
// row, composed here with RolePill so the look can be reviewed before that
// prop is actually added.
export const WithRoleBadgePreview = {
  render: () => (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <Typography variant="h3">Dashboard</Typography>
        <RolePill name="Contributor" active tone="orange" />
      </div>
      <Typography variant="subtitle1" gutterBottom>
        What you are working on, what you earned, and when it lands.
      </Typography>
    </div>
  )
}
