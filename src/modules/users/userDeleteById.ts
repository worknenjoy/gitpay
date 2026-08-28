import models from '../../models'
import db from '../../models/index'
import { taskDeleteById } from '../tasks/index'

const currentModels = models as any
const sequelize = (db as any).sequelize

type UserDeleteByIdParams = {
  id: number
}

export async function userDeleteById(userParameters: UserDeleteByIdParams) {
  try {
    return await sequelize.transaction(async (t: any) => {
      const tasks = await currentModels.Task.findAll({
        where: {
          userId: userParameters.id
        }
      })

      for (const task of tasks) {
        await taskDeleteById(
          {
            id: task.dataValues.id,
            userId: userParameters.id
          },
          t
        )
      }

      // PaymentRequestPayment references PaymentRequestCustomer/PaymentRequest/PaymentRequestTransfer,
      // so it must be deleted before any of those.
      await currentModels.PaymentRequestPayment.destroy({
        where: { userId: userParameters.id },
        transaction: t
      })

      // PaymentRequestBalanceTransaction has no userId column - it only references
      // PaymentRequestBalance, so it must be looked up via the user's balances and
      // deleted before those balances to satisfy the FK constraint.
      const balances = await currentModels.PaymentRequestBalance.findAll({
        where: { userId: userParameters.id },
        transaction: t
      })
      const balanceIds = balances.map((balance: any) => balance.id)
      if (balanceIds.length > 0) {
        await currentModels.PaymentRequestBalanceTransaction.destroy({
          where: { paymentRequestBalanceId: balanceIds },
          transaction: t
        })
      }

      await currentModels.PaymentRequestTransfer.destroy({
        where: { userId: userParameters.id },
        transaction: t
      })
      await currentModels.PaymentRequestCustomer.destroy({
        where: { userId: userParameters.id },
        transaction: t
      })
      await currentModels.PaymentRequestBalance.destroy({
        where: { userId: userParameters.id },
        transaction: t
      })
      await currentModels.PaymentRequest.destroy({
        where: { userId: userParameters.id },
        transaction: t
      })
      await currentModels.Payout.destroy({ where: { userId: userParameters.id }, transaction: t })
      await currentModels.Assign.destroy({ where: { userId: userParameters.id }, transaction: t })
      await currentModels.Offer.destroy({ where: { userId: userParameters.id }, transaction: t })
      await sequelize.query(`DELETE FROM "User_Types" WHERE "UserId" = ${userParameters.id}`, {
        transaction: t
      })

      const user = await currentModels.User.destroy({
        where: {
          id: userParameters.id
        },
        force: true,
        transaction: t
      })

      // eslint-disable-next-line no-console
      console.log('destroy', user)

      return user
    })
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log('error to delete user', err)
    throw err
  }
}
