import models from '../../models'

const currentModels = models as any

type RoleExistsParams = {
  name: string
}

export async function roleExists(roleAttributes: RoleExistsParams) {
  try {
    const role = await currentModels.Role.findOne({
      where: {
        name: roleAttributes.name
      }
    })
    
    if (!role) return false
    return role
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('error to obtain existent role', error)
    throw error
  }
}
