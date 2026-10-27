import models from '../../models'
import SendMail from '../../mail/mail'
import i18n from 'i18n'

const currentModels = models as any

export async function removeAssignedUser({ id, userId }: any, { message }: any) {
  const task = await currentModels.Task.findOne(
    {
      where: {
        id
      }
    },
    {
      include: [currentModels.User, currentModels.Order, currentModels.Assign]
    }
  )

  if (!task) {
    const error: any = new Error('Task not found')
    error.status = 404
    error.StatusCodeError = 404
    throw error
  }

  if (Number(task.userId) !== Number(userId)) {
    const error: any = new Error('Unauthorized')
    error.status = 403
    error.StatusCodeError = 403
    throw error
  }

  const assignedId = task.assigned

  if (!assignedId) {
    const error: any = new Error("The Task doesn't have an assigned user.")
    error.status = 400
    error.StatusCodeError = 400
    throw error
  }

  const assignedPromise = await currentModels.Assign.findByPk(assignedId, {
    include: [currentModels.User]
  })

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
}
