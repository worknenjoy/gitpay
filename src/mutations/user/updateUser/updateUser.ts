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
  [key: string]: any
}

export const updateUser = async (userParameters: UserParameters, tx: Transaction) => {
  const result = await models.User.update(userParameters, {
    where: { id: userParameters.id },
    returning: true,
    plain: true,
    transaction: tx
  })
  const currentUser = result[1]
  return currentUser
}
