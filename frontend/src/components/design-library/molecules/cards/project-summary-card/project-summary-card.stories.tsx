import type { Meta, StoryObj } from '@storybook/react'
import ProjectSummaryCard from './project-summary-card'

const meta: Meta<typeof ProjectSummaryCard> = {
  title: 'Design Library/Molecules/Cards/ProjectSummaryCard',
  component: ProjectSummaryCard,
  args: {
    project: {
      id: 1,
      name: 'gitpay',
      org: 'worknenjoy',
      orgUrl: 'https://github.com/worknenjoy',
      description: 'Payment platform for open-source work delivered.',
      openBountyCount: 8,
      totalPaid: 12480,
      issuesCount: 142,
      projectUrl: '#/organizations/1/projects/1',
      ProgrammingLanguages: [{ name: 'TypeScript' }, { name: 'React' }, { name: 'Go' }]
    }
  }
}
export default meta

type Story = StoryObj<typeof ProjectSummaryCard>

export const Default: Story = {}
