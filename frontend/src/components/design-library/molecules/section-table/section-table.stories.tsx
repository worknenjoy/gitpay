import React from 'react';
import SectionTable from './section-table';

export default {
  title: 'Design Library/Molecules/SectionTable',
  component: SectionTable,
}

const Template = (args) => <SectionTable {...args} />;

export const Table = Template.bind({});
Table.args = {
  // Add default props here
  tableData: {
    completed: true,
    data: [
      {
        id: 1,
        name: 'John Doe',
        email: 'john@gmail.com',
        role: 'Admin',
        status: 'Active',
        action: 'Edit',
        other: 'Other',
      },
      {
        id: 2,
        name: 'Jane Doe',
        email: 'jane@gmail.com',
        role: 'User',
        status: 'Inactive',
        action: 'Edit',
        other: 'Other',
      },
    ],
  },
  tableHeaderMetadata: {
    "id": { sortable: true, numeric: true, dataBaseKey: "id", label: 'Id' },
    "name": { sortable: true, dataBaseKey: "name", label: 'Name' },
    "email": { sortable: true, dataBaseKey: "email", label: 'Email' },
    "role": { sortable: true, dataBaseKey: "role", label: 'Role' },
    "status": { sortable: true, dataBaseKey: "status", label: 'Status' },
    "action": { sortable: false, dataBaseKey: "action", label: 'Action' },
  },
  customColumnRenderer: {
    action: (item) => <a href='#'>{item.action}</a>,
  }
};