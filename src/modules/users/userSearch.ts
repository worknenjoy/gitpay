import Models from '../../models'

const models = Models as any

// Public, unauthenticated attributes — safe to return for any lookup (e.g. by id, for public profiles).
const PUBLIC_ATTRIBUTES = [
  'id',
  'website',
  'profile_url',
  'picture_url',
  'name',
  'username',
  'provider',
  'repos',
  'openForJobs',
  'skills',
  'languages',
  'country',
  'createdAt',
  'updatedAt'
]

export const userSearch = async (params: any) => {
  try {
    // `email` is only safe to return when the caller already proved ownership of the account
    // (e.g. a single-use recover_password_token mailed to that address) — never for an
    // arbitrary public lookup like `?id=`, which this same function also serves.
    const attributes =
      params && params.recover_password_token ? [...PUBLIC_ATTRIBUTES, 'email'] : PUBLIC_ATTRIBUTES

    const users = await models.User.findAll({
      where: params || {},
      attributes,
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
