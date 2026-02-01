import { labelSearch } from '../../modules/label'

export const labelSearchController = async (req: any, res: any) => {
  try {
    // Use query parameters for GET requests
    const data = await labelSearch(req.query)
    res.status(200).send(data)
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log('error on types', error)
    res.status(401).send(error)
  }
}
