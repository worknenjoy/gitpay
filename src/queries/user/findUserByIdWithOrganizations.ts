import Models from '../../models'

const models = Models as any

export const findUserByIdWithOrganizations = async (id: number, options: any = {}) => {
  return models.User.findByPk(id, {
    ...options,
    include: [
      models.Type,
      {
        model: models.Organization,
        include: [
          {
            model: models.Project,
            include: [models.Task]
          }
        ]
      }
    ]
  })
}
