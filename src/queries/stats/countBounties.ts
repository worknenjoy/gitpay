import Models from '../../models'

const models = Models as any

export const countBounties = async (): Promise<number> => {
  return models.Task.count()
}
