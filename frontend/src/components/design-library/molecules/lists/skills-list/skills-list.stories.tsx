import type { Meta, StoryObj } from '@storybook/react'
import SkillsList from './skills-list'

const meta: Meta<typeof SkillsList> = {
  title: 'Design Library/Molecules/Lists/SkillsList',
  component: SkillsList,
  parameters: {
    layout: 'padded'
  }
}

export default meta
type Story = StoryObj<typeof SkillsList>

export const Default: Story = {
  args: {
    skills: [
      'TypeScript',
      'JavaScript',
      'React',
      'Node.js',
      'Next.js',
      'GraphQL',
      'PostgreSQL',
      'Stripe API',
      'Tailwind CSS',
      'Jest',
      'Cypress',
      'Docker',
      'AWS',
      'CI/CD',
      'REST APIs',
      'WebSockets'
    ]
  }
}
