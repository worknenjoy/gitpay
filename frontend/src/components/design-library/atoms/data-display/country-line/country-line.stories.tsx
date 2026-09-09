import type { Meta, StoryObj } from '@storybook/react'
import CountryLine from './country-line'

const meta: Meta<typeof CountryLine> = {
  title: 'Design Library/Atoms/Data Display/CountryLine',
  component: CountryLine,
  parameters: {
    layout: 'centered'
  }
}

export default meta
type Story = StoryObj<typeof CountryLine>

export const Default: Story = {
  args: {
    image: 'brazil',
    countryName: 'Brazil',
    utcOffset: '−03:00'
  }
}

export const NoOffset: Story = {
  args: {
    image: 'portugal',
    countryName: 'Portugal'
  }
}
