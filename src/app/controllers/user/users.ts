import { userTypes } from '../../../modules/users/userTypes'
import { userSearch } from '../../../modules/users/userSearch'

export const getUserTypes = async (req: any, res: any) => {
  try {
    const userId = req.params.id
    const data = await userTypes(userId)
    res.status(200).send(data)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error)
    res.status(400).send(error)
  }
}

export const searchAll = async (req: any, res: any) => {
  try {
    const data = await userSearch(req.query)
    res.send(data)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error)
    res.send(false)
  }
}
