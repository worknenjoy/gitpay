import models from '../../models'

const currentModels = models as any

type MemberExistsParams = {
  userId: number
  taskId: number
}

export async function memberExists(memberAttributes: MemberExistsParams) {
  try {
    const member = await currentModels.Member.findOne({
      where: {
        userId: memberAttributes.userId,
        taskId: memberAttributes.taskId
      }
    })
    
    if (!member) return false
    return member
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('error to obtain existent member', error)
    throw error
  }
}
