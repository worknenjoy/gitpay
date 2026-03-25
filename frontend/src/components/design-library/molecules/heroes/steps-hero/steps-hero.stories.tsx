import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import StepsHero, { Step } from './steps-hero'

const meta: Meta<typeof StepsHero> = {
  title: 'Design Library/Molecules/Heroes/StepsHero',
  component: StepsHero,
  parameters: {
    layout: 'fullscreen'
  }
}
export default meta

type Story = StoryObj<typeof StepsHero>

const contributorSteps: Step[] = [
  {
    number: '1',
    title: 'Find an issue you love',
    description: 'Browse open bounties across projects and pick what excites you',
    numberColor: '#bdd5cb'
  },
  {
    number: '2',
    title: 'Submit your solution',
    description: 'Work on the issue, open a pull request and get it merged',
    numberColor: '#73b89a'
  },
  {
    number: '3',
    title: 'Get paid instantly',
    description: 'Receive your bounty directly once your contribution is approved',
    numberColor: '#008d5d'
  }
]

const maintainerSteps: Step[] = [
  {
    number: '1',
    title: 'Attach a bounty to any issue',
    description: 'Set a reward on any GitHub issue in seconds, no extra tooling needed',
    numberColor: '#c9d9f5'
  },
  {
    number: '2',
    title: 'Attract contributors',
    description: 'Developers worldwide discover and claim your bounties automatically',
    numberColor: '#7aaae8'
  },
  {
    number: '3',
    title: 'Ship faster, pay on merge',
    description: 'Release payment when the pull request is merged — fully automated',
    numberColor: '#2563eb'
  }
]

export const ForContributors: Story = {
  args: {
    title: 'How do I start earning?',
    steps: contributorSteps
  }
}

export const ForMaintainers: Story = {
  args: {
    title: 'How does it work for maintainers?',
    steps: maintainerSteps
  }
}
