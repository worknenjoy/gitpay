import { Transaction } from 'sequelize'
import Models = require('../../../models')

const models = Models as any

export type TypeRef = { id: number }

export interface UserParameters {
  id: number
  name?: string
  email?: string
  account_id?: string
  Types?: TypeRef[]
  pending_email_change?: string
  email_change_token?: string
  email_change_token_expires_at?: Date
  email_change_requested_at?: Date
  email_change_attempts?: number
  [key: string]: any
}

export const updateUser = async (userParameters: UserParameters, tx?: Transaction) => {
  const result = await models.User.update(userParameters, {
    where: { id: userParameters.id },
    returning: true,
    plain: true,
    ...(tx ? { transaction: tx } : {})
  })
  const currentUser = result[1]
  return currentUser
}
