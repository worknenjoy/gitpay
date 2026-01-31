import Models from '../../src/models'

const models = Models as any

export const AssignFactory = async (paramsOverwrite: any = {}, options: any = {}) => {
  const defaultParams = {
    status: 'pending'
  }
  const assign = await models.Assign.create({ ...defaultParams, ...paramsOverwrite }, options)
  return assign
}
