import BaseTitle from './base-title'

const meta = {
  title: 'Design Library/Atoms/Typography/Titles/BaseTitle',
  component: BaseTitle,
  args: {
    title: 'Sample Title',
    subtitle: 'This is a subtitle'
  },
  argTypes: {
    level: {
      control: { type: 'string', options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] },
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
