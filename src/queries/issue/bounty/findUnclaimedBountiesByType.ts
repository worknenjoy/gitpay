import Models from '../../../models'
import { findUnclaimedBounties } from './findUnclaimedBounties'

const models = Models as any

type UnclaimedBountyTypes =
  | 'all'
  | 'with_linked_PR_and_gitpay_user'
  | 'with_linked_PR_and_public_provider_email'
  | 'with_linked_PR_and_hidden_provider_email'
  | 'without_linked_PR'

export const findUnclaimedBountiesByType = async ({ type }: { type: UnclaimedBountyTypes }) => {
  const pendingTasks = await findUnclaimedBounties()

  if (type === 'all') {
    return pendingTasks
  }
  return pendingTasks
}
