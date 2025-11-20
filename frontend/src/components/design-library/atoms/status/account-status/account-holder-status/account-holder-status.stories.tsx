import ProfileHeaderStatus from './account-holder-status'

const meta = {
  title: 'Design Library/Atoms/Status/Account/AccountHolderStatus',
  component: ProfileHeaderStatus,
  args: {
    status: 'Active',
    color: 'green',
  },
  argTypes: {
    status: { control: 'text' },
    color: { control: 'color' },
  },
}

export default meta

export const Default = {
  args: {
    status: 'active',
  },
}

export const Pending = {
  args: {
    status: 'pending',
  },
}

export const Inactive = {
  args: {
    status: 'inactive',
  },
}

export const Unknown = {
  args: {
    status: 'unknown',
  },
}

export const Loading = {
  args: {
    status: 'pending',
    completed: false,
  },
}
