import { languageSearch, projectProgrammingLanguage } from '../../modules/language'

export const languageSearchController = async (req: any, res: any) => {
  try {
    // Use query parameters for GET requests
    const data = await languageSearch(req.query)
    res.status(200).send(data)
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log('error on types', error)
    res.status(401).send(error)
  }
}

export const projectLanguageSearchController = async (req: any, res: any) => {
  try {
    // Use query parameters for GET requests
    const data = await projectProgrammingLanguage()
    res.status(200).send(data)
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log('error on types', error)
    res.status(401).send(error)
  }
}
