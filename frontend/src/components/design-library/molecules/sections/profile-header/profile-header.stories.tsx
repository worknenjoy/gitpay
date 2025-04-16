import React from 'react';
import ProfileHeader from './profile-header';

export default {
  title: 'Design Library/Molecules/Sections/ProfileHeader',
  component: ProfileHeader,
};

const Template = (args) => <ProfileHeader {...args} />;

export const Default = Template.bind({});
Default.args = {
  title: 'Profile Header',
  subtitle: 'This is a subtitle',
};