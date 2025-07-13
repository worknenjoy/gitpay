import React from 'react';
import PrimaryDataPage from './primary-data-page';
import { withProfileTemplate } from '../../../../../../../.storybook/decorators/withPrivateTemplate';
import { generateTableData } from '../../../../../../../.storybook/utils/generateTableData';

const meta = {
  title: 'Design Library/Pages/Private/Data Pages/PrimaryDataPage',
  component: PrimaryDataPage,
  decorators: [withProfileTemplate]
};

export default meta;

export const Default = {
  args: {
    title: 'Primary Data Page',
    description: 'This is a simple primary data page for demonstration.',
    tabs: [
      {
        label: 'Tab 1',
        value: 'tab1',
        table: {
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
        }
      },
      {
        label: 'Tab 2',
        value: 'tab2',
        table: {
          tableData: {
            completed: true,
            data: generateTableData(5)
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
        }
      },
    ],
    user: {
      completed: true,
      data: {
        id: '1',
        name: 'John Doe',
        Types: [
          { name: 'contributor' },
          { name: 'maintainer' },
          { name: 'funding' }
        ]
      }
    },
  },
};