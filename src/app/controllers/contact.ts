import { contactRecruiters as contactRecruitersModule } from '../../modules/contact'

export const contactRecruiters = async (req: any, res: any) => {
  try {
    const data = await contactRecruitersModule(req.body)
    res.status(200).send(data)
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log('error on contactRecruiters', error)
    res.status(401).send(error)
  }
}
