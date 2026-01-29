import models from '../../models'
import SendMail from '../mail/mail'
import i18n from 'i18n'

const currentModels = models as any

export async function removeAssignedUser({ id, userId }: any, { message }: any) {
  try {
    const task = await currentModels.Task.findOne(
      {
        where: {
          id
          // userId
        }
      },
      {
        include: [currentModels.User, currentModels.Order, currentModels.Assign]
      }
    )

    const assignedId = task.assigned

    if (!assignedId) throw new Error("The Task doesn't have an assigned user.")

    const assignedPromise = await currentModels.Assign.findByPk(assignedId, { include: [currentModels.User] })

    const author = await currentModels.User.findByPk(task.userId)

    // Unset assigned value,
    const saveTaskPromise = task.set('assigned', null).save()
    const changeStatusPromise = task.set('status', 'open').save()
    const changeStatusAssign = assignedPromise.set('status', 'pending').save()

    const [assign] = await Promise.all([
      assignedPromise,
      saveTaskPromise,
      changeStatusPromise,
      changeStatusAssign
    ])

    const user = assign.User
    const language = user.language || 'en'
    i18n.setLocale(language)
    SendMail.success(
      assign.User,
      i18n.__('mail.assign.remove.subject'),
      i18n.__('mail.assign.remove.message', {
        message,
        url: `${process.env.FRONTEND_HOST}/#/task/${task.id}`,
        title: task.title
      })
    )

    const ownerUser = author
    const ownerlanguage = ownerUser.language || 'en'
    i18n.setLocale(ownerlanguage)
    SendMail.success(
      ownerUser,
      i18n.__('mail.assign.remove.owner.subject'),
      i18n.__('mail.assign.remove.owner.message', {
        title: task.title,
        user: user.name || user.username,
        email: user.email,
        message: message,
        url: `${process.env.FRONTEND_HOST}/#/task/${task.id}}`
      })
    )
    return task.dataValues
  } catch (error) {
    throw error
  }
}
