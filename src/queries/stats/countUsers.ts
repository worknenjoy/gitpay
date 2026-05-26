import Models from '../../models'

const models = Models as any

export const countUsers = async (): Promise<number> => {
  return models.User.count()
}
