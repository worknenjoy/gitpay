import React from 'react'
import { FormattedMessage } from 'react-intl'

import PlanCard from './plan-card'
import { usePlanTranslation } from './usePlanTranslation'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design Library/Molecules/Cards/PlanCard',
  component: PlanCard
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  //argTypes: {
  //  tags: { control: '' },
  //},
}

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template = (args) => <PlanCard {...args} />

export const Primary = Template.bind({})
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  plan: {
    fee: 8,
    title: 'Plan Title',
    category: 'Category',
    price: 100,
    items: ['Feature 1', 'Feature 2', 'Feature 3']
  }
}

// Example using FormattedMessage components (current recommended approach)
export const WithFormattedMessages = Template.bind({})
WithFormattedMessages.args = {
  plan: {
    fee: 8,
    category: (
      <FormattedMessage
        id="actions.task.payment.plan.opensource"
        defaultMessage="Open Source"
      />
    ),
    title: (
      <FormattedMessage
        id="actions.task.payment.plan.opensource.info"
        defaultMessage="For Open Source Project"
      />
    ),
    items: [
      <FormattedMessage
        key="1"
        id="actions.task.payment.plan.bullet.public"
        defaultMessage="For Public Projects"
      />,
      <FormattedMessage
        key="2"
        id="actions.task.payment.plan.bullet.basic"
        defaultMessage="Basic Campaign"
      />
    ]
  }
}

// Example using the usePlanTranslation hook for dynamic translation
const PlanCardWithHook = () => {
  const translatedPlan = usePlanTranslation({
    fee: 8,
    categoryId: 'actions.task.payment.plan.opensource',
    titleId: 'actions.task.payment.plan.opensource.info',
    itemIds: [
      'actions.task.payment.plan.bullet.public',
      'actions.task.payment.plan.bullet.basic'
    ]
  })

  return <PlanCard plan={translatedPlan} />
}

export const WithTranslationHook = () => <PlanCardWithHook />
