import models from '../../models'

const currentModels = models as any

type UserPreferencesParams = {
  id: number
}

export async function userPreferences(userAttributes: UserPreferencesParams) {
  try {
    const user = await currentModels.User.findOne({
      where: {
        id: userAttributes.id
      }
    })

    if (!user) return false

    if (user && !user.dataValues) return false

    if (user.length <= 0) return false

    return {
      language: user.dataValues.language,
      country: user.dataValues.country,
      os: user.dataValues.os,
      skills: user.dataValues.skills,
      languages: user.dataValues.languages,
      receiveNotifications:
        user.dataValues.receiveNotifications != null && user.dataValues.receiveNotifications,
      openForJobs: user.dataValues.openForJobs != null && user.dataValues.openForJobs
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error)
    throw error
  }
}
