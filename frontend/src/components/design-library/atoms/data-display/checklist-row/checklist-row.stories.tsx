import ChecklistRow from './checklist-row'

const meta = {
  title: 'Design Library/Atoms/DataDisplay/ChecklistRow',
  component: ChecklistRow
}

export default meta

export const RequiredNow = {
  args: {
    title: 'Identity document',
    description: 'Government-issued ID and a selfie, uploaded on Whop',
    status: 'required'
  }
}

export const Done = {
  args: {
    title: 'Company profile',
    description: 'Name, country and contact email confirmed',
    status: 'done'
  }
}

export const Pending = {
  args: {
    title: 'Gitpay connection',
    description: 'Connecting your Whop company to Gitpay',
    status: 'pending'
  }
}

export const Loading = {
  args: { title: 'Identity document', status: 'required', completed: false }
}
