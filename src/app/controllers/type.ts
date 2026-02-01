import { typeSearch } from '../../modules/types'

export const typeSearchController = async (req: any, res: any) => {
  try {
    const data = await typeSearch()
    res.status(200).send(data)
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log('error on types', error)
    res.status(401).send(error)
  }
}
