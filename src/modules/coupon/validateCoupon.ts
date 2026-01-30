import models from '../../models'

const currentModels = models as any

type ValidateCouponPayload = {
  code: string
  originalOrderPrice: number
}

export async function validateCoupon(payload: ValidateCouponPayload) {
  try {
    const data = await currentModels.Coupon.findOne({ where: { code: payload.code } })

    if (data) {
      if (data.dataValues.times === 0) {
        throw new Error('COUPON_MAX_TIMES_EXCEEDED')
      }

      const calculatedOrderPrice =
        payload.originalOrderPrice - payload.originalOrderPrice * (data.dataValues.amount / 100)

      return { ...data.dataValues, orderPrice: calculatedOrderPrice }
    }

    throw new Error('COUPON_DOES_NOT_EXISTS')
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err)
    throw err
  }
}
