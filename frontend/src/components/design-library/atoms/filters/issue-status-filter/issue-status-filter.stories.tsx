import type { Meta, StoryObj } from '@storybook/react'
import IssueStatusFilter from './issue-status-filter'

// /src/components/design-library/atoms/filters/status-filter/status-filter.stories.tsx

const meta: Meta<typeof IssueStatusFilter> = {
  title: 'design-library/atoms/Filters/IssueStatus',
  component: IssueStatusFilter,
  args: {}
}
export default meta

type Story = StoryObj<typeof IssueStatusFilter>

export const Default: Story = {}
