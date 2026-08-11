import React from 'react'
import { Typography } from '@mui/material'
import WhopAccountTabs from './whop-account-tabs'

const meta = {
  title: 'Design Library/Molecules/Tabs/WhopAccountTabs',
  component: WhopAccountTabs
}

export default meta

export const Default = {
  args: {
    children: <Typography>Identity &amp; business panel</Typography>
  }
}

export const RequirementsDue = {
  args: {
    requirementsDue: true,
    children: <Typography>Identity &amp; business panel</Typography>
  }
}
