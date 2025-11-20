import React from 'react'
import SectionTable from './section-table'
import { generateTableData } from '../../../../../../.storybook/utils/generateTableData'
import ActionsField from '../section-table/section-table-custom-fields/base/action-field/action-field'

export default {
  title: 'Design Library/Molecules/Tables/SectionTable',
  component: SectionTable,
}

const Template = (args) => <SectionTable {...args} />

export const Table = Template.bind({})
Table.args = {
  // Add default props here
  tableData: {
    completed: true,
    data: generateTableData(25),
  },
  tableHeaderMetadata: {
    id: { sortable: true, numeric: true, dataBaseKey: 'id', label: 'Id' },
    name: { sortable: true, dataBaseKey: 'name', label: 'Name' },
    email: { sortable: true, dataBaseKey: 'email', label: 'Email' },
    role: { sortable: true, dataBaseKey: 'role', label: 'Role' },
    status: { sortable: true, dataBaseKey: 'status', label: 'Status' },
    action: { sortable: false, label: 'Action' },
  },
  customColumnRenderer: {
    action: (item) => (
      <ActionsField
        actions={[
          {
            children: 'View',
            onClick: () => alert(`View action clicked for ${item.name}`),
            icon: null,
          },
          {
            children: 'Edit',
            onClick: () => alert(`Edit action clicked for ${item.name}`),
            icon: null,
          },
        ]}
      />
    ),
  },
}

export const Loading = Template.bind({})
Loading.args = {
  tableData: {
    completed: false,
    data: [],
  },
  tableHeaderMetadata: {
    id: { sortable: true, numeric: true, dataBaseKey: 'id', label: 'Id' },
    name: { sortable: true, dataBaseKey: 'name', label: 'Name' },
    email: { sortable: true, dataBaseKey: 'email', label: 'Email' },
    role: { sortable: true, dataBaseKey: 'role', label: 'Role' },
    status: { sortable: true, dataBaseKey: 'status', label: 'Status' },
    action: { sortable: false, dataBaseKey: 'action', label: 'Action' },
  },
  customColumnRenderer: {
    action: (item) => <a href="#">{item.action}</a>,
  },
}

export const Empty = Template.bind({})
Empty.args = {
  tableData: {
    completed: true,
    data: [],
  },
  tableHeaderMetadata: {
    id: { sortable: true, numeric: true, dataBaseKey: 'id', label: 'Id' },
    name: { sortable: true, dataBaseKey: 'name', label: 'Name' },
    email: { sortable: true, dataBaseKey: 'email', label: 'Email' },
    role: { sortable: true, dataBaseKey: 'role', label: 'Role' },
    status: { sortable: true, dataBaseKey: 'status', label: 'Status' },
    action: { sortable: false, dataBaseKey: 'action', label: 'Action' },
  },
  customColumnRenderer: {
    action: (item) => <a href="#">{item.action}</a>,
  },
}
