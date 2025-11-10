import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import SpotCard from './spot-card';

const meta: Meta<typeof SpotCard> = {
  title: 'Design Library/Molecules/Cards/SpotCard',
  component: SpotCard
};

export default meta;

type Story = StoryObj<typeof SpotCard>;

export const Default: Story = {
  render: (args) => <SpotCard {...(args as any)} />,
  args: {
    // Adjust these props to match SpotCard's API. They are placeholders.
    title: 'Spot title',
    subtitle: 'Optional subtitle',
    children: 'This is a spot card description.'
  } as any
};