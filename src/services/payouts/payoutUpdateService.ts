import models from '../../models'
import {
  updatePayoutRecord,
  UpdatePayoutRecordParams
} from '../../mutations/payout/updatePayoutRecord'
import PayoutMail from '../../mail/payout'

const currentModels = models as any

export async function payoutUpdateService(params: UpdatePayoutRecordParams) {
  const payout = await updatePayoutRecord(params)

  const user = await currentModels.User.findByPk(payout.userId)
  if (!user) return payout

  if (payout.status === 'paid') {
    await PayoutMail.payoutPaid(user, payout)
  } else if (payout.status === 'failed' || payout.status === 'canceled') {
    await PayoutMail.payoutFailed(user, payout)
  } else {
    await PayoutMail.payoutUpdated(user, payout)
  }

  return payout
}
