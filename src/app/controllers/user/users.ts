import { userTypes } from '../../../modules/users/userTypes'
import { userSearch } from '../../../modules/users/userSearch'
import { userProfileStats } from '../../../modules/users/userProfileStats'
import { userMaintainedProjects } from '../../../modules/users/userMaintainedProjects'

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

export const getUserProfileStats = async (req: any, res: any) => {
  try {
    const data = await userProfileStats(req.params.id)
    res.status(200).send(data)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error)
    res.status(400).send(error)
  }
}

export const getUserMaintainedProjects = async (req: any, res: any) => {
  try {
    const data = await userMaintainedProjects(req.params.id)
    res.status(200).send(data)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error)
    res.status(400).send(error)
  }
}
