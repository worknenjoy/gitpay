import { userChangeEmail } from '../../../modules/users/userChangeEmail'

export const changeEmail = async (req: any, res: any) => {
  const userId = req.user.id
  const { newEmail } = req.body

  try {
    // Assume updateEmail is a function that updates the user's email in the database
    await userChangeEmail({userId, newEmail})
    res.status(200).send({ message: 'Email updated successfully' })
  } catch (error) {
    console.error('Error changing email:', error)
    res.status(500).send({ error: 'Error changing email' })
  }
}