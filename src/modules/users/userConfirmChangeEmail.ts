import { findUser } from '../../queries/user/findUser'
import { updateUser } from '../../mutations/user/updateUser/updateUser'
import Models from '../../models'
import UserMail from '../../mail/user'
import updateUserAccount from '../../mutations/user/updateUser/updateUserAccount'

const models = Models as any

export const userConfirmChangeEmail = async ({ token }: { token: string }): Promise<any> => {
  if (!token) {
    throw new Error('user.confirm_change_email.missing_parameters')
  }

  const userToUpdate = await findUser({ email_change_token: token })
  if (!userToUpdate) {
    throw new Error('user.confirm_change_email.user_not_found')
  }

  if (userToUpdate.email_change_token !== token) {
    throw new Error('user.confirm_change_email.invalid_token')
  }

  if (userToUpdate.email_change_token_expires_at! < new Date()) {
    throw new Error('user.confirm_change_email.token_expired')
  }

  if (!userToUpdate.pending_email_change) {
    throw new Error('user.confirm_change_email.no_pending_email_change')
  }

  const userExist = await findUser({ email: userToUpdate.pending_email_change! })
  if (userExist) {
    throw new Error('user.confirm_change_email.email_already_in_use')
  }

  if (userToUpdate.email_change_attempts! >= 5) {
    throw new Error('user.confirm_change_email.too_many_attempts')
  }

  if (userToUpdate.pending_email_change === userToUpdate.email) {
    throw new Error('user.confirm_change_email.email_already_set')
  }

  if (userToUpdate.provider) {
    throw new Error('user.confirm_change_email.cannot_change_email_for_provider')
  }

  return models.sequelize.transaction(async (tx: any) => {
    const updatedUser = await updateUser(
      {
        id: userToUpdate.id,
        email: userToUpdate.pending_email_change,
        pending_email_change: null,
        email_change_token: null,
        email_change_token_expires_at: null,
        email_change_requested_at: null,
        email_change_attempts: 0
      },
      tx
    )

    await updateUserAccount(updatedUser)
    UserMail.confirmedChangeUserEmail({ user: updatedUser })
    UserMail.confirmedChangeUserEmailOldEmail({ user: userToUpdate })

    return updatedUser
  })
}
