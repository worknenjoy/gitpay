import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import PricingPublicPage from './pricing-public-page';

const meta: Meta<typeof PricingPublicPage> = {
  title: 'Design Library/Pages/Public/PricingPublic',
  component: PricingPublicPage,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof PricingPublicPage>;

export const Basic: Story = {
  args: {},
};