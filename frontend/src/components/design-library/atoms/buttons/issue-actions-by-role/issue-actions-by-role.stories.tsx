import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import IssueActionsByRole from './issue-actions-by-role';

// Simple mock issue data
const mockIssue = {
	data: {
		id: 123,
		value: '100',
		paid: false,
		transfer_id: null,
		Transfer: null,
		private: false,
	},
};

export default {
	title: 'Design Library/Atoms/Buttons/IssueActionsByRole',
	component: IssueActionsByRole,
} as ComponentMeta<typeof IssueActionsByRole>;

const Template: ComponentStory<typeof IssueActionsByRole> = (args) => (
  <IssueActionsByRole {...args} />
);

export const Admin: typeof Template = Template.bind({});
Admin.args = {
	issue: mockIssue,
	currentRole: 'admin',
};

export const User: typeof Template = Template.bind({});
User.args = {
	issue: mockIssue,
	currentRole: 'user',
};

