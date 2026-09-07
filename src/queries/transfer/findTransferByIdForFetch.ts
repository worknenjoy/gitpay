import Models from '../../models'
import { publicUserInclude } from '../../utils/auth/user-secret-attributes'

const models = Models as any

export const findTransferByIdForFetch = async (id: number, options: any = {}) => {
  return models.Transfer.findOne({
    where: { id },
    include: [
      models.Task,
      publicUserInclude(models.User, 'User'),
      publicUserInclude(models.User, 'destination')
    ],
    ...options
  })
}
