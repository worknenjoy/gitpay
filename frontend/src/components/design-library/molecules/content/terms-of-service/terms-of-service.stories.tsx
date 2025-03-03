import React from 'react';
import TermsOfService from './terms-of-service';

export default {
  title: 'Design Library/Molecules/Content/TermsOfService',
  component: TermsOfService,
};

const Template = (args) => <TermsOfService {...args} />;

export const Default = Template.bind({});
Default.args = {
  // Add default props here if any
};