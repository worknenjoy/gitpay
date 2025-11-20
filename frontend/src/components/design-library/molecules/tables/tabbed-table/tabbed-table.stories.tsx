import React from 'react'
import TabbedTable from './tabbed-table'
import { generateTableData } from '../../../../../../.storybook/utils/generateTableData'

const meta = {
  title: 'Design Library/Molecules/Tables/TabbedTable/TabbedTable',
  component: TabbedTable
}

export default meta

const tabs = [
  {
    label: 'Tab 1',
    value: 'tab1',
    table: {
      tableData: {
        completed: true,
        data: generateTableData(25)
      },
      tableHeaderMetadata: {
        id: { sortable: true, numeric: true, dataBaseKey: 'id', label: 'Id' },
        name: { sortable: true, dataBaseKey: 'name', label: 'Name' },
        email: { sortable: true, dataBaseKey: 'email', label: 'Email' },
        role: { sortable: true, dataBaseKey: 'role', label: 'Role' },
        status: { sortable: true, dataBaseKey: 'status', label: 'Status' },
        action: { sortable: false, dataBaseKey: 'action', label: 'Action' }
      },
      customColumnRenderer: {
        action: (item) => <a href="#">{item.action}</a>
      }
    }
  },
  {
    label: 'Tab 2',
    value: 'tab2',
    cards: [{ title: 'Total Users', amount: '1250' }],
    table: {
      tableData: {
        completed: true,
        data: generateTableData(5)
      },
      tableHeaderMetadata: {
        id: { sortable: true, numeric: true, dataBaseKey: 'id', label: 'Id' },
        name: { sortable: true, dataBaseKey: 'name', label: 'Name' },
        email: { sortable: true, dataBaseKey: 'email', label: 'Email' },
        role: { sortable: true, dataBaseKey: 'role', label: 'Role' },
        status: { sortable: true, dataBaseKey: 'status', label: 'Status' },
        action: { sortable: false, dataBaseKey: 'action', label: 'Action' }
      },
      customColumnRenderer: {
        action: (item) => <a href="#">{item.action}</a>
      }
    }
  }
]

export const Default = {
  args: {
    tabs
  }
}
