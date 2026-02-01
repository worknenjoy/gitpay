import Models from '../../src/models'
const models = Models as any

export const TaskFactory = async (paramsOverwrite: any = {}) => {
  const defaultParams = {
    title: 'Sample Issue',
    description: 'This is a sample issue description.',
    paid: false,
    value: 100,
    userId: 1,
    provider: 'github',
    url: `https://github.com/worknenjoy/gitpay/issues/${Math.floor(Math.random() * 10000)}`,
    status: 'open'
  }
  try {
    const task = await models.Task.create({ ...defaultParams, ...paramsOverwrite })
    return task
  } catch (error) {
    console.error('Error creating Task:', error)
    throw error
  }
}

// Deprecated: Use TaskFactory instead
export const IssueFactory = TaskFactory
