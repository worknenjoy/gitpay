import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import SectionHero from './section-hero'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch'
import SecurityIcon from '@mui/icons-material/Security'
import freelancerImage from 'images/collections/collection-flat-community.svg'
import companiesImage from 'images/collections/collection-flat-companies.svg'

const meta: Meta<typeof SectionHero> = {
  title: 'Design Library/Molecules/Heroes/SectionHero',
  component: SectionHero,
  parameters: {
    layout: 'fullscreen',
  },
}
export default meta

type Story = StoryObj<typeof SectionHero>

const items = [
  {
    icon: <CheckCircleOutlineIcon />,
    primaryText: 'Get started quickly',
    secondaryText: 'Kick off your project in minutes with simple setup.',
  },
  {
    icon: <RocketLaunchIcon />,
    primaryText: 'Scale with confidence',
    secondaryText: 'Built for performance and growth.',
  },
  {
    icon: <SecurityIcon />,
    primaryText: 'Secure by default',
    secondaryText: 'Best practices and protections included.',
  },
]

export const Default: Story = {
  args: {
    title: 'Build faster, launch smarter',
    image: freelancerImage,
    items,
  },
}

export const Contrast: Story = {
  args: {
    contrast: true,
    title: 'Build faster, launch smarter',
    image: companiesImage,
    items,
  },
}
