import Models from '../../models'

const models = Models as any

export const userSearch = async (params: any) => {
  try {
    const users = await models.User.findAll({
      where: params || {},
      attributes: [
        'id',
        'website',
        'profile_url',
        'picture_url',
        'name',
        'username',
        'email',
        'provider',
        'account_id',
        'paypal_id',
        'repos',
        'createdAt',
        'updatedAt'
      ],
      include: [models.Type]
    })

    if (!users || users.length <= 0) return false

    return users
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log(error)
    return false
  }
}
