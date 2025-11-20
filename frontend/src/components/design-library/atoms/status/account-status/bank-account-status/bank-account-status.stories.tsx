import BankAccountStatus from './bank-account-status'

const meta = {
  title: 'Design Library/Atoms/Status/Account/BankAccountStatus',
  component: BankAccountStatus,
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
    status: 'new',
  },
}

export const Validated = {
  args: {
    status: 'validated',
  },
}

export const Verified = {
  args: {
    status: 'verified',
  },
}

export const Invalid = {
  args: {
    status: 'errored',
  },
}

export const VerificationFailed = {
  args: {
    status: 'verification_failed',
  },
}

export const Unknown = {
  args: {
    status: 'unknown',
  },
}
export const Loading = {
  args: {
    status: 'new',
    completed: false,
  },
}
