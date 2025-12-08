import type { Meta, StoryObj } from '@storybook/react';
import DashboardCardList from './dashboard-card-list';

const meta: Meta<typeof DashboardCardList> = {
  title: 'Design Library/Molecules/Cards/DashboardCards/DashboardCardList',
  component: DashboardCardList,
  parameters: {
    layout: 'centered',
  }
};

export default meta;
type Story = StoryObj<typeof DashboardCardList>;

export const Default: Story = {
  args: {
    info: {
      completed: true,
      data: {
        activeIssues: 5,
        closedIssues: 10,
      },  
    },
    user: {
      completed: true,
      data: {
        username: 'johndoe',
        email: 'johndoe@example.com',
        Types: [
          { id: 1, name: 'contributor', label: 'Contributor' },
          { id: 2, name: 'maintainer', label: 'Maintainer' },
          { id: 3, name: 'funding', label: 'Funding' }
        ]
      }
    }
  }
};

export const LoadingState: Story = {
  args: {
    info: {
      completed: false,
      data: {}
    },
    user: {
      completed: false,
      data: {}
    }
  }
};