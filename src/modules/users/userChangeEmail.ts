import { updateUser } from '../../mutations/user/updateUser/updateUser'
import { findUser } from '../../queries/user/findUser'
import Models from '../../models'
import UserMail from '../../modules/mail/user'

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
  if (
    !userId ||
    !newEmail ||
    (currentPassword && !confirmCurrentPassword) ||
    (!currentPassword && confirmCurrentPassword)
  ) {
    throw new Error('user.change_email.missing_parameters')
  }

  const userToUpdate = await findUser({ id: userId })
  if (!userToUpdate) {
    throw new Error('user.change_email.user_not_found')
  }

  const userExist = await findUser({ email: newEmail })
  if (userExist) {
    throw new Error('user.change_email.email_already_in_use')
  }

  if (currentPassword !== confirmCurrentPassword) {
    throw new Error('user.change_email.passwords_do_not_match')
  }

  if (userToUpdate.provider) {
    throw new Error('user.change_email.cannot_change_email_for_provider')
  }

  const isPasswordCorrect = userToUpdate.verifyPassword(currentPassword, userToUpdate.password)
  if (!isPasswordCorrect) {
    throw new Error('user.change_email.current_password_incorrect')
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

  if (!userUpdated) {
    throw new Error('user.change_email.failed_to_update')
  }

  UserMail.changeEmailNotification(userUpdated)
  UserMail.alertOldEmailAboutChange(userUpdated)

  return userUpdated
}
