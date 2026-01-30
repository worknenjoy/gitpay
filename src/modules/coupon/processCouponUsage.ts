import models from '../../models'

const currentModels = models as any

export async function processCouponUsage(coupon: any) {
  // Coupon max times exceeded
  if (coupon.times === 0) {
    return false
  }

  // Coupon expired
  if (coupon.validUntil < new Date()) {
    return false
  }

  try {
    await currentModels.Coupon.update({ times: coupon.times - 1 }, { where: { code: coupon.code } })
    return true
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err)
    throw err
  }
}
