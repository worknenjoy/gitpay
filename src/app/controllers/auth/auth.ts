import { userChangeEmail } from '../../../modules/users/userChangeEmail'

export const changeEmail = async (req: any, res: any) => {
  const userId = req.user.id
  const { newEmail, currentPassword, confirmCurrentPassword } = req.body

  try {
    const data = await userChangeEmail({
      userId,
      newEmail,
      currentPassword,
      confirmCurrentPassword
    })
    res.status(200).send(data)
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'user.change_email.failed' })
  }
}
