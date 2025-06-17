import React from 'react';
import ProjectCard from './project-card';
import ProjectListSimple from './project-list-simple';
import ProjectList from './project-list';

export default {
  title: 'Design Library/Molecules/Cards/ProjectCard',
  component: ProjectCard
};

const Template = (args) => <ProjectCard className={undefined} project={undefined} {...args} />;

export const DefaultProjectCard = Template.bind({});
DefaultProjectCard.args = {
  title: 'Project 1',
  description: 'Description 1',
  status: 'Open',
  project: {
    title: 'Project 1',
    description: 'Description 1',
    status: 'Open'
  }
};

export const ProjectListSimpleStory = (args) => <ProjectListSimple listProjects={undefined} projects={undefined} user={undefined} {...args} />;
ProjectListSimpleStory.args = {
  projects: [
    { title: 'Project 1', description: 'Description 1', status: 'Open' },
    { title: 'Project 2', description: 'Description 2', status: 'Closed' }
  ]
};

export const ProjectListStory = (args) => <ProjectList listProjects={undefined} projects={undefined} {...args} />;
ProjectListStory.args = {
  projects: [
    { title: 'Project 1', description: 'Description 1', status: 'Open' },
    { title: 'Project 2', description: 'Description 2', status: 'Closed' },
    { title: 'Project 3', description: 'Description 3', status: 'In Progress' }
  ]
};