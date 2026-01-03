import Models from '../../models'

const models = Models as any

export const userTypes = async (userId: any) => {
  try {
    const user = await models.User.findOne({
      where: { id: userId },
      include: [
        {
          model: models.Type,
          as: 'Types',
          attributes: ['id', 'name']
        }
      ],
      attributes: ['id', 'name', 'profile_url', 'picture_url', 'website']
    })

    if (!user) {
      return {}
    }

    return user
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log('error on user types', error)
    throw error
  }
}
