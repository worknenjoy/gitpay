import { notifyUnclamedBounties } from '../../services/issues/claims/unclaimedBountyService'

const notifyUnclamedBountiesScript = async () => {
  await notifyUnclamedBounties()
}

notifyUnclamedBountiesScript()
