import { validateCoupon as couponValidate } from '../../modules/coupon'

export const validateCoupon = async (req: any, res: any) => {
  try {
    const data = await couponValidate(req.body)
    res.send(data)
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log(error)
    res.status(400).send({ error: error.message })
  }
}
