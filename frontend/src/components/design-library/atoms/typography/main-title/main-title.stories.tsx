import Title from './main-title'

const meta = {
  title: 'Design Library/Atoms/Typography/Titles/MainTitle',
  component: Title,
  args: {
    title: 'Sample Title',
    subtitle: 'This is a subtitle'
  },
  argTypes: {
    level: {
      control: { type: 'number', min: 1, max: 6 },
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
