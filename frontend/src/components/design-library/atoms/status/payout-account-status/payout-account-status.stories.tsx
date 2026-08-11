import PayoutAccountStatus from './payout-account-status'

const meta = {
  title: 'Design Library/Atoms/Status/PayoutAccountStatus',
  component: PayoutAccountStatus
}

export default meta

export const PayoutsActive = {
  args: { status: 'active' }
}

export const VerificationRequired = {
  args: { status: 'verification_required' }
}

export const Pending = {
  args: { status: 'pending' }
}

export const Rejected = {
  args: { status: 'rejected' }
}

export const Loading = {
  args: { status: 'active', completed: false }
}
