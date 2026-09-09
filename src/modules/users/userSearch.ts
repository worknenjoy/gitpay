import Models from '../../models'

const models = Models as any

const ALLOWED_FILTERS = ['id', 'username', 'recover_password_token']

const PUBLIC_ATTRIBUTES = [
  'id',
  'website',
  'profile_url',
  'picture_url',
  'name',
  'username',
  'provider',
  'repos',
  'country',
  'skills',
  'openForJobs',
  'createdAt',
  'updatedAt'
]

export const userSearch = async (params: any) => {
  try {
    const where: Record<string, any> = {}
    for (const key of ALLOWED_FILTERS) {
      if (params && params[key] !== undefined) {
        where[key] = params[key]
      }
    }

    // The reset-password page looks a user up by their token and needs the email
    // to know who it's resetting; every other lookup is a public directory search,
    // where email/paypal_id/account_id must stay out of the allow-list entirely.
    const isRecoverTokenLookup = Object.prototype.hasOwnProperty.call(
      where,
      'recover_password_token'
    )
    const attributes = isRecoverTokenLookup ? [...PUBLIC_ATTRIBUTES, 'email'] : PUBLIC_ATTRIBUTES

    const users = await models.User.findAll({
      where,
      attributes,
      include: [{ model: models.Type, attributes: ['id', 'name'], through: { attributes: [] } }]
    })

    if (!users || users.length <= 0) return false

    return users
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log(error)
    return false
  }
}
