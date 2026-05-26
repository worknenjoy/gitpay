import Models from '../../models'

const models = Models as any

export const getLatestStats = async () => {
  return models.PlatformPublicStats.findOne({
    order: [['createdAt', 'DESC']]
  })
}
