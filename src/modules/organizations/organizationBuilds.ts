import models from '../../models'

const currentModels = models as any

type OrganizationBuildsParams = {
  name?: string
  provider?: string
  provider_username?: string
  provider_id?: string
  provider_token?: string
  [key: string]: any
}

export async function organizationBuilds(organizationParameters: OrganizationBuildsParams) {
  try {
    const data = await currentModels.Organization.build(organizationParameters).save()
    return data
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('error from organizationBuilds', error)
    return false
  }
}
