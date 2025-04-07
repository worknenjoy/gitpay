import React from 'react';
import { Breadcrumb } from './breadcrumb';
import task from 'src/components/areas/public/features/task/task';

export default {
  title: 'Design Library/Molecules/Breadcrumbs/Breadcrumb',
  component: Breadcrumb,
};

const Template = (args) => <Breadcrumb {...args} />;

export const Default = Template.bind({});
Default.args = {
  task: {
    completed: true,
    data: {
      id: 1,
      title: 'Task 1',
    },
  },
  user: {
    completed: true,
    data: {
      id: 1,
      username: 'User 1',
    },
  },
  project: {
    completed: true,
    data: {
      id: 1,
      name: 'Project 1',
    },
  },
  organization: {
    name: 'Organization 1',
  }
};

export const Loading = Template.bind({});
Loading.args = {
  task: {
    completed: false,
    data: {},
  },
  user: {
    completed: false,
    data: {},
  },
  project: {
    completed: false,
    data: {},
  },
  organization: {
    completed: false,
    data: {},
  },
};