import { userChangeEmail } from '../../../modules/users/userChangeEmail'
import { userConfirmChangeEmail } from '../../../modules/users/userConfirmChangeEmail'

export const changeEmail = async (req: any, res: any) => {
  const userId = req.user.id
  const { newEmail, currentPassword, confirmCurrentPassword } = req.body

  try {
    const changeEmailParams = {
      userId,
      newEmail,
      currentPassword,
      confirmCurrentPassword
    }
    const data = await userChangeEmail(changeEmailParams)
    res.status(200).send(data)
  } catch (error: any) {
    console.log('error on request change email', error)
    res.status(500).json({ error: error.message || 'user.change_email.failed' })
  }
}

export const confirmChangeEmail = async (req: any, res: any) => {
  const { token } = req.query
  try {
    const data = await userConfirmChangeEmail({
      token
    })
    if (data) {
      res.redirect(`${process.env.FRONTEND_HOST}/#/signin/email-change-confirmed`)
    } else {
      res.redirect(`${process.env.FRONTEND_HOST}/#/signin/email-change-failed`)
    }
  } catch (error: any) {
    console.log('error on confirm change email', error)
    res.redirect(`${process.env.FRONTEND_HOST}/#/signin/email-change-failed`)
  }
}
