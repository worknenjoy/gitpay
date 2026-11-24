import type { Meta, StoryObj } from '@storybook/react'
import AvatarStack from './avatar-stack'

const meta: Meta<typeof AvatarStack> = {
  title: 'Design Library/Atoms/DataDisplay/AvatarStack',
  component: AvatarStack,
  parameters: { layout: 'centered' }
}

export default meta
type Story = StoryObj<typeof AvatarStack>

const people = [
  { name: 'worknenjoy' },
  { name: 'defnax' },
  { name: 'Anonymous', anonymous: true },
  { name: 'tbilous' },
  { name: 'mkaruza' }
]

export const Default: Story = {
  args: { people: people.slice(0, 3) }
}

export const Single: Story = {
  args: { people: people.slice(0, 1), size: 'lg' }
}

export const Small: Story = {
  args: { people: people.slice(0, 2), size: 'sm' }
}

export const WithMax: Story = {
  args: { people, max: 3 }
}

export const WithImages: Story = {
  args: {
    people: [
      { name: 'octocat', avatarUrl: 'https://avatars.githubusercontent.com/u/583231?v=4' },
      { name: 'defnax' }
    ]
  }
}

export const Empty: Story = {
  args: { people: [] }
}
