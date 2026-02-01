import * as Offers from '../../modules/offers'

// update offer
export const updateOffer = async ({ params, body }: any, res: any) => {
  try {
    const data = await Offers.updateOffer(params, body)
    res.send(data)
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log('error on task controller update offer', error)
    res.send({ error: error.message })
  }
}
