import { getInfo } from '../../modules/info'

export const info = async (req: any, res: any) => {
  try {
    const data = await getInfo()
    res.send(data)
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e)
    res.status(500).send(false)
  }
}
