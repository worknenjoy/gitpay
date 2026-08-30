import models from '../../models'

const currentModels = models as any

export async function organizationList(params?: any) {
  try {
    // This route is public — never include full User rows (password hash,
    // recover_password_token, email, account_id, etc.). Whitelist display-safe fields only.
    const data = await currentModels.Organization.findAll({
      include: [
        {
          model: currentModels.Project,
          include: [currentModels.Organization]
        },
        {
          model: currentModels.User,
          attributes: ['id', 'name', 'username', 'picture_url']
        }
      ]
    })
    return data
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error)
    return false
  }
}
