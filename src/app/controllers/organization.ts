import * as Organizations from '../../modules/organizations'

export const listOrganizations = async (req: any, res: any) => {
  try {
    const data = await Organizations.organizationList(req.params)
    res.send(data)
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log(error)
    res.send(false)
  }
}

export const fetchOrganization = async (req: any, res: any) => {
  try {
    const data = await Organizations.organizationFetch(req.params || req.query)
    res.send(data)
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log(error)
    res.send(false)
  }
}

export const createOrganization = async (req: any, res: any) => {
  try {
    req.body.userId = req.user.id
    const data = await Organizations.organizationBuilds(req.body)
    res.send(data)
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log(error)
    res.send(error)
  }
}

export const updateOrganization = async (req: any, res: any) => {
  try {
    req.body.userId = req.user.id
    const data = await Organizations.organizationUpdate(req.body)
    res.send(data)
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log(error)
    res.send(error)
  }
}
