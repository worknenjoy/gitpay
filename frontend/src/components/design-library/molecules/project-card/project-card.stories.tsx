import React from 'react';
import { Meta, Story } from '@storybook/react';
import ProjectCard from './project-card';
import ProjectListSimple from './project-list-simple';
import ProjectList from './project-list';
import { project } from '../../../../reducers/projectReducer';

export default {
  title: 'Design Library/Molecules/ProjectCard',
  component: ProjectCard,
} as Meta;

const Template: Story = (args) => <ProjectCard className={undefined} project={undefined} {...args} />;

export const DefaultProjectCard = Template.bind({});
DefaultProjectCard.args = {
  title: 'Project 1',
  description: 'Description 1',
  status: 'Open',
  project: {
    title: 'Project 1',
    description: 'Description 1',
    status: 'Open',
  },
};

export const ProjectListSimpleStory: Story = (args) => <ProjectListSimple listProjects={undefined} projects={undefined} user={undefined} {...args} />;
ProjectListSimpleStory.args = {
  projects: [
    { title: 'Project 1', description: 'Description 1', status: 'Open' },
    { title: 'Project 2', description: 'Description 2', status: 'Closed' },
  ],
};

export const ProjectListStory: Story = (args) => <ProjectList listProjects={undefined} projects={undefined} {...args} />;
ProjectListStory.args = {
  projects: [
    { title: 'Project 1', description: 'Description 1', status: 'Open' },
    { title: 'Project 2', description: 'Description 2', status: 'Closed' },
    { title: 'Project 3', description: 'Description 3', status: 'In Progress' },
  ],
};