import { requestJoinCoreTeam } from '../../modules/team'

export const requestJoinCoreTeamController = async (req: any, res: any) => {
  try {
    const data = await requestJoinCoreTeam(req.body)
    res.status(200).send(data)
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log('error on requestJoinCoreTeam', error)
    res.status(401).send(error)
  }
}
