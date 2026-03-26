import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import ServicePaymentsPublicPage from './service-payments-public-page'

const meta: Meta<typeof ServicePaymentsPublicPage> = {
  title: 'Design Library/Pages/Public/ServicePaymentsPublicPage',
  component: ServicePaymentsPublicPage,
  parameters: {
    layout: 'fullscreen'
  }
}
export default meta

type Story = StoryObj<typeof ServicePaymentsPublicPage>

export const Default: Story = {}
