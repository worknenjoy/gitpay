import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import PayoutScheduleForm from './payout-schedule-form';

export default {
  title: 'Design Library/Organisms/Forms/PayoutForms/PayoutScheduleForm',
  component: PayoutScheduleForm,
} as ComponentMeta<typeof PayoutScheduleForm>;

const Template: ComponentStory<typeof PayoutScheduleForm> = (args) => (
  <PayoutScheduleForm {...args} />
);

export const Default = Template.bind({});
Default.args = {
  // Add default props here if needed
};