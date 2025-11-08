import React from 'react';
import PrivacyPolicy from './privacy-policy';

export default {
  title: 'Design Library/Molecules/Content/Terms/PrivacyPolicy',
  component: PrivacyPolicy
};

const Template = (args) => <PrivacyPolicy {...args} />;

export const Default = Template.bind({});
Default.args = {};

export const WithoutHeader = Template.bind({});
WithoutHeader.args = {
  noHeader: true,
};

export const WithAgreeButton = Template.bind({});
WithAgreeButton.args = {
  onAgreeTerms: () => alert('Agreed to Privacy Policy'),
};

export const WithExtraStyles = Template.bind({});
WithExtraStyles.args = {
  extraStyles: true,
};

export const WithArrowBack = Template.bind({});
WithArrowBack.args = {
  onArrowBack: () => alert('Arrow back clicked'),
};
