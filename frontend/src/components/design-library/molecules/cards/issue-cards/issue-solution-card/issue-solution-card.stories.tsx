import React from 'react'
import IssueSolutionCard from './issue-solution-card'

export default {
  title: 'Design Library/Molecules/Cards/IssueSolutionCard',
  component: IssueSolutionCard
}

const Template = (args) => <IssueSolutionCard {...args} />

export const Default = Template.bind({})
Default.args = {
  task: {
    transfer_id: '12329JFDLLS',
    Transfer: {
      value: 100
    }
  },
  taskSolution: {
    pullRequestURL: 'https://github.com/owner/repo/pull/1',
    isPRMerged: true,
    isIssueClosed: true
  }
}
