import DetailRow from './detail-row'

const meta = {
  title: 'Design Library/Atoms/DataDisplay/DetailRow',
  component: DetailRow
}

export default meta

export const Default = {
  args: { label: 'Legal name', value: 'Alexandre Magno' }
}

export const WithHint = {
  args: { label: 'Account type', value: 'Individual', hint: 'sole contributor' }
}

export const WithStatus = {
  args: { label: 'Identity check', status: 'VERIFIED', statusColor: 'success' }
}

export const Empty = {
  args: { label: 'Tax form', value: '' }
}

export const Loading = {
  args: { label: 'Legal name', value: 'Alexandre Magno', completed: false }
}
