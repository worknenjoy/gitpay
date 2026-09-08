import Models from '../../models'

const models = Models as any

// Sole caller (deleteUserAccount) returns this straight to the API response --
// selfView keeps the caller's own payout IDs but strips auth secrets.
export const findUserByIdWithOrganizations = async (id: number, options: any = {}) => {
  return models.User.scope('selfView').findByPk(id, {
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
