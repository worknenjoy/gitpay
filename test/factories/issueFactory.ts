import Models from '../../src/models'
const models = Models as any

export const IssueFactory = async (paramsOverwrite: any = {}) => {
  const defaultParams = {
    title: 'Sample Issue',
    description: 'This is a sample issue description.',
    paid: false,
    value: 100,
    userId: 1
  }
  const issue = await models.Task.create({ ...defaultParams, ...paramsOverwrite })
  return issue
}
