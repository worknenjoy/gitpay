import { expect } from 'chai'
import request from 'supertest'
import api from '../../../src/server'
import Models from '../../../src/models'
import { truncateModels } from '../../helpers'
import { UserFactory, TaskFactory } from '../../factories'

const models = Models as any
const agent = request.agent(api)

describe('GET /tasksolutions-public/:userId', () => {
  beforeEach(async () => {
    await truncateModels(models.TaskSolution)
    await truncateModels(models.Task)
    await truncateModels(models.User)
  })

  it('returns only the whitelisted fields for the user\'s pull requests', async () => {
    const user = await UserFactory()
    const task = await TaskFactory({ userId: user.id, title: 'Fix the bug' })
    const solution = await models.TaskSolution.create({
      pullRequestURL: 'https://github.com/worknenjoy/gitpay/pull/42',
      isPRMerged: true,
      isIssueClosed: true,
      taskId: task.id,
      userId: user.id
    })

    const res = await agent.get(`/tasksolutions-public/${user.id}`).expect(200)

    expect(res.body).to.have.lengthOf(1)
    const [pr] = res.body
    expect(pr.id).to.equal(solution.id)
    expect(pr.pullRequestURL).to.equal('https://github.com/worknenjoy/gitpay/pull/42')
    expect(pr.isPRMerged).to.equal(true)
    expect(pr.isIssueClosed).to.equal(true)
    expect(pr.Task.id).to.equal(task.id)
    expect(pr.Task.title).to.equal('Fix the bug')
    expect(pr.userId).to.be.undefined
  })

  it('returns an empty array for a user with no submitted solutions', async () => {
    const user = await UserFactory()

    const res = await agent.get(`/tasksolutions-public/${user.id}`).expect(200)

    expect(res.body).to.deep.equal([])
  })

  it('does not return another user\'s pull requests', async () => {
    const owner = await UserFactory()
    const other = await UserFactory()
    const task = await TaskFactory({ userId: owner.id })
    await models.TaskSolution.create({
      pullRequestURL: 'https://github.com/worknenjoy/gitpay/pull/1',
      taskId: task.id,
      userId: owner.id
    })

    const res = await agent.get(`/tasksolutions-public/${other.id}`).expect(200)

    expect(res.body).to.deep.equal([])
  })

  it('400s for a non-numeric userId', async () => {
    await agent.get('/tasksolutions-public/not-a-number').expect(400)
  })
})
