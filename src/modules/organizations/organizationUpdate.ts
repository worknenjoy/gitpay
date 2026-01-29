import models from '../../models'

const currentModels = models as any

type OrganizationUpdateParams = {
  id: number
  name?: string
  provider?: string
  provider_username?: string
  provider_id?: string
  provider_token?: string
  [key: string]: any
}

export async function organizationUpdate(organizationParameters: OrganizationUpdateParams) {
  try {
    const organization = await currentModels.Organization.update(organizationParameters, {
      where: {
        id: organizationParameters.id
      },
      returning: true,
      plain: true
    })
    if (!organization) return false
    return organization[1]
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error)
    return false
  }
}
