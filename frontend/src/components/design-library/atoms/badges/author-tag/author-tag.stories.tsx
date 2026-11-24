import type { Meta, StoryObj } from '@storybook/react'
import AuthorTag from './author-tag'

const meta: Meta<typeof AuthorTag> = {
  title: 'Design Library/Atoms/Badges/AuthorTag',
  component: AuthorTag,
  parameters: { layout: 'centered' }
}

export default meta
type Story = StoryObj<typeof AuthorTag>

export const Verified: Story = { args: { variant: 'verified' } }
export const NotAuthor: Story = { args: { variant: 'notAuthor' } }
