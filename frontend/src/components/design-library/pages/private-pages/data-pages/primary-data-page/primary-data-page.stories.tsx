import React from 'react'
import { action } from '@storybook/addon-actions'
import PrimaryDataPage from './primary-data-page'
import { withProfileTemplate } from '../../../../../../../.storybook/decorators/withPrivateTemplate'
import { generateTableData } from '../../../../../../../.storybook/utils/generateTableData'

const meta = {
  title: 'Design Library/Pages/Private/DataPages/PrimaryData',
  component: PrimaryDataPage,
  decorators: [withProfileTemplate]
}

export default meta

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
    ],
    user: {
      completed: true,
      data: {
        id: '1',
        name: 'John Doe',
        Types: [{ name: 'contributor' }, { name: 'maintainer' }, { name: 'funding' }]
      }
    }
  }
}

export const SingleTableMode = {
  args: {
    title: 'Primary Data Page',
    description: 'This is a simple primary data page for demonstration.',
    table: {
      tableData: {
        completed: true,
        data: generateTableData(15)
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
    },
    user: {
      completed: true,
      data: {
        id: '1',
        name: 'John Doe',
        Types: [{ name: 'contributor' }, { name: 'maintainer' }, { name: 'funding' }]
      }
    }
  }
}

export const LoadingState = {
  args: {
    title: 'Primary Data Page',
    description: 'This is a simple primary data page for demonstration.',
    tabs: [
      {
        label: 'Tab 1',
        value: 'tab1',
        table: {
          tableData: {
            completed: false,
            data: []
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
    ],
    user: {
      completed: true,
      data: {
        id: '1',
        name: 'John Doe',
        Types: [{ name: 'contributor' }, { name: 'maintainer' }, { name: 'funding' }]
      }
    }
  }
}

export const EmptyState = {
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
            data: []
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
    ],
    activeTab: 'tab1',
    user: {
      completed: true,
      data: {
        id: '1',
        name: 'John Doe',
        Types: [{ name: 'contributor' }, { name: 'maintainer' }, { name: 'funding' }]
      }
    }
  }
}

export const WithActionButton = {
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
            data: generateTableData(10)
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
    ],
    displayAction: true,
    onActionClick: action('onActionClick'),
    onActionText: 'Add New Item',
    user: {
      completed: true,
      data: {
        id: '1',
        name: 'John Doe',
        Types: [{ name: 'contributor' }, { name: 'maintainer' }, { name: 'funding' }]
      }
    }
  }
}
