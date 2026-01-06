import { updateUser } from '../../mutations/user/updateUser/updateUser'
import { findUser } from '../../queries/user/findUser'
import Models from '../../models'

const models = Models as any

type UserChangeEmailParams = {
  userId: number
  newEmail: string
  currentPassword?: string
  confirmCurrentPassword?: string
}

export const userChangeEmail = async ({
  userId,
  newEmail,
  currentPassword,
  confirmCurrentPassword
}: UserChangeEmailParams): Promise<void> => {
  if(!userId || !newEmail || (currentPassword && !confirmCurrentPassword) || (!currentPassword && confirmCurrentPassword)) {
    throw new Error('Invalid parameters')
  }

  const userToUpdate = await findUser({ id: userId })
  if (!userToUpdate) {
    throw new Error('User not found')
  }

  // Here you would typically generate a token and set expiration, omitted for brevity
  const emailChangeToken = models.User.generateToken()

  const userUpdated = await updateUser({
    id: userId,
    pending_email_change: newEmail,
    email_change_token: emailChangeToken,
    email_change_token_expires_at: new Date(Date.now() + 3600 * 1000), // Token expires in 1 hour
    email_change_requested_at: new Date(),
    email_change_attempts: 1
  })

  if(!userUpdated) {
    throw new Error('Failed to update user email change request')
  }

  
  
  return userUpdated
}