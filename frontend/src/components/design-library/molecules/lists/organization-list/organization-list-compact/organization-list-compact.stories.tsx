import React from 'react';
import OrganizationListCompact from './organization-list-compact';

export default {
  title: 'Design Library/Molecules/Lists/Organizations/OrganizationListCompact',
  component: OrganizationListCompact
};

const Template = (args) => <OrganizationListCompact {...args} />;

export const OrganizationListCompactStory = Template.bind({});
OrganizationListCompactStory.args = {
  listOrganizations: () => {},
  organizations: {
    completed: true,
    data: [
      {
        id: 1,
        name: 'Organization 1',
        description: 'Description 1',
        provider: 'GitHub',
        User: { id: 1, name: 'User 1' },
        Projects: [
          { id: 1, name: 'Project 1' },
          { id: 2, name: 'Project 2' }
        ]
      },
      {
        id: 2,
        name: 'Organization 2',
        description: 'Description 2',
        provider: 'Bitbucket',
        User: { id: 2, name: 'User 2' },
        Projects: [
          { id: 3, name: 'Project 3' }
        ]
      }
    ]
  }
};
