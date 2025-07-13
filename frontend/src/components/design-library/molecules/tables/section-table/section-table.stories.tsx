import React from 'react';
import SectionTable from './section-table';
import { generateTableData } from '../../../../../../.storybook/utils/generateTableData';

export default {
  title: 'Design Library/Molecules/Tables/SectionTable',
  component: SectionTable
}

const Template = (args) => <SectionTable {...args} />;

export const Table = Template.bind({});
Table.args = {
  // Add default props here
  tableData: {
    completed: true,
    data: generateTableData(25)
  },
  tableHeaderMetadata: {
    "id": { sortable: true, numeric: true, dataBaseKey: "id", label: 'Id' },
    "name": { sortable: true, dataBaseKey: "name", label: 'Name' },
    "email": { sortable: true, dataBaseKey: "email", label: 'Email' },
    "role": { sortable: true, dataBaseKey: "role", label: 'Role' },
    "status": { sortable: true, dataBaseKey: "status", label: 'Status' },
    "action": { sortable: false, dataBaseKey: "action", label: 'Action' }
  },
  customColumnRenderer: {
    action: (item) => <a href="#">{item.action}</a>
  }
};