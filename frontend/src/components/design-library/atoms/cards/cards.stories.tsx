import React from 'react';
import TeamCard from './TeamCard';
import { link } from 'fs';

export default {
  title: 'Design Library/Atoms/Cards',
  component: TeamCard,
};

const TeamTemplate = (args) => <TeamCard {...args} />;

export const Team = TeamTemplate.bind({});
Team.args = {
  data: [
    {
      name: 'John Doe',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      image: 'https://via.placeholder.com/150',
      linkedinUrl: 'https://www.linkedin.com/',
      githubUrl: 'https://github.com/test',
    },
    {
      name: 'Jane Doe',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      image: 'https://via.placeholder.com/150',
      linkedinUrl: 'https://www.linkedin.com/',
      githubUrl: 'https://github.com/anothertest',
    },
  ]
};