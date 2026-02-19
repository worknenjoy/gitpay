import { Op } from 'sequelize'
import Models from '../../models'

const models = Models as any

export const findIssuesCreatedBefore = async (before: Date, options: any = {}) => {
  return models.Task.findAll({
    where: {
      createdAt: {
        [Op.lt]: before
      }
    },
    ...options
  })
}
