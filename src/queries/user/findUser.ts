import Models from '../../models'
const models = Models as any

// Both current callers (userChangeEmail, userConfirmChangeEmail) need password/
// email-change-token fields for their own internal checks -- never a direct response.
export const findUser = async (params: any) => {
  return models.User.scope('withSensitive').findOne({
    where: params,
    include: [
      {
        model: models.Type,
        as: 'Types'
      }
    ]
  })
}
