import { expect } from 'chai'
import sinon from 'sinon'
import models from '../../../src/models'
import { taskSearch } from '../../../src/modules/tasks/taskSearch'

describe('taskSearch - Organization task sorting and pagination (#1599)', () => {
  let projectFindAllStub: sinon.SinonStub
  let taskFindAndCountAllStub: sinon.SinonStub

  beforeEach(() => {
    projectFindAllStub = sinon.stub(models.Project, 'findAll' as any)
    taskFindAndCountAllStub = sinon.stub(models.Task, 'findAndCountAll' as any)
  })

  afterEach(() => {
    sinon.restore()
  })

  it('sorts tasks by value ASC across multiple projects before pagination with tie-breaker', async () => {
    // Project A has tasks with value 10 and 30
    // Project B has tasks with value 20 and 5
    const mockProjects = [
      {
        id: 1,
        name: 'Project A',
        OrganizationId: 1,
        Tasks: [
          { id: 1, title: 'Task 1', value: 10, status: 'open', ProjectId: 1 },
          { id: 2, title: 'Task 2', value: 30, status: 'open', ProjectId: 1 }
        ]
      },
      {
        id: 2,
        name: 'Project B',
        OrganizationId: 1,
        Tasks: [
          { id: 3, title: 'Task 3', value: 20, status: 'open', ProjectId: 2 },
          { id: 4, title: 'Task 4', value: 5, status: 'open', ProjectId: 2 }
        ]
      }
    ]

    projectFindAllStub.resolves(mockProjects)

    // Page 0, limit 2
    const page0Result: any = await taskSearch({
      organizationId: '1',
      sortBy: 'value',
      sortDirection: 'asc',
      limit: '2',
      page: '0'
    })

    expect(page0Result.count).to.equal(4)
    expect(page0Result.rows).to.have.lengthOf(2)
    expect(page0Result.rows[0].id).to.equal(4) // value 5
    expect(page0Result.rows[1].id).to.equal(1) // value 10

    // Page 1, limit 2
    const page1Result: any = await taskSearch({
      organizationId: '1',
      sortBy: 'value',
      sortDirection: 'asc',
      limit: '2',
      page: '1'
    })

    expect(page1Result.count).to.equal(4)
    expect(page1Result.rows).to.have.lengthOf(2)
    expect(page1Result.rows[0].id).to.equal(3) // value 20
    expect(page1Result.rows[1].id).to.equal(2) // value 30
  })

  it('sorts tasks by value DESC across multiple projects before pagination', async () => {
    const mockProjects = [
      {
        id: 1,
        name: 'Project A',
        OrganizationId: 1,
        Tasks: [
          { id: 1, title: 'Task 1', value: 10, status: 'open' },
          { id: 2, title: 'Task 2', value: 30, status: 'open' }
        ]
      },
      {
        id: 2,
        name: 'Project B',
        OrganizationId: 1,
        Tasks: [
          { id: 3, title: 'Task 3', value: 20, status: 'open' },
          { id: 4, title: 'Task 4', value: 5, status: 'open' }
        ]
      }
    ]

    projectFindAllStub.resolves(mockProjects)

    // Page 0, limit 2
    const page0Result: any = await taskSearch({
      organizationId: '1',
      sortBy: 'value',
      sortDirection: 'desc',
      limit: '2',
      page: '0'
    })

    expect(page0Result.count).to.equal(4)
    expect(page0Result.rows).to.have.lengthOf(2)
    expect(page0Result.rows[0].id).to.equal(2) // value 30
    expect(page0Result.rows[1].id).to.equal(3) // value 20

    // Page 1, limit 2
    const page1Result: any = await taskSearch({
      organizationId: '1',
      sortBy: 'value',
      sortDirection: 'desc',
      limit: '2',
      page: '1'
    })

    expect(page1Result.count).to.equal(4)
    expect(page1Result.rows).to.have.lengthOf(2)
    expect(page1Result.rows[0].id).to.equal(1) // value 10
    expect(page1Result.rows[1].id).to.equal(4) // value 5
  })

  it('breaks ties deterministically by id when values are equal', async () => {
    const mockProjects = [
      {
        id: 1,
        Tasks: [
          { id: 10, value: 20, status: 'open' },
          { id: 30, value: 20, status: 'open' }
        ]
      },
      {
        id: 2,
        Tasks: [{ id: 20, value: 20, status: 'open' }]
      }
    ]

    projectFindAllStub.resolves(mockProjects)

    const ascResult: any = await taskSearch({
      organizationId: '1',
      sortBy: 'value',
      sortDirection: 'asc',
      limit: '3',
      page: '0'
    })

    expect(ascResult.rows.map((r: any) => r.id)).to.deep.equal([10, 20, 30])

    const descResult: any = await taskSearch({
      organizationId: '1',
      sortBy: 'value',
      sortDirection: 'desc',
      limit: '3',
      page: '0'
    })

    expect(descResult.rows.map((r: any) => r.id)).to.deep.equal([30, 20, 10])
  })

  it('sorts tasks by title alphabetically', async () => {
    const mockProjects = [
      {
        id: 1,
        Tasks: [
          { id: 1, title: 'Zebra', value: 0 },
          { id: 2, title: 'Apple', value: 0 }
        ]
      },
      {
        id: 2,
        Tasks: [{ id: 3, title: 'Mango', value: 0 }]
      }
    ]

    projectFindAllStub.resolves(mockProjects)

    const ascResult: any = await taskSearch({
      organizationId: '1',
      sortBy: 'title',
      sortDirection: 'asc',
      limit: '10',
      page: '0'
    })

    expect(ascResult.rows.map((r: any) => r.title)).to.deep.equal(['Apple', 'Mango', 'Zebra'])

    const descResult: any = await taskSearch({
      organizationId: '1',
      sortBy: 'title',
      sortDirection: 'desc',
      limit: '10',
      page: '0'
    })

    expect(descResult.rows.map((r: any) => r.title)).to.deep.equal(['Zebra', 'Mango', 'Apple'])
  })

  it('sorts tasks by createdAt timestamp', async () => {
    const mockProjects = [
      {
        id: 1,
        Tasks: [
          { id: 1, createdAt: new Date('2026-03-01T00:00:00Z') },
          { id: 2, createdAt: new Date('2026-01-01T00:00:00Z') }
        ]
      },
      {
        id: 2,
        Tasks: [{ id: 3, createdAt: new Date('2026-02-01T00:00:00Z') }]
      }
    ]

    projectFindAllStub.resolves(mockProjects)

    const ascResult: any = await taskSearch({
      organizationId: '1',
      sortBy: 'createdAt',
      sortDirection: 'asc',
      limit: '10',
      page: '0'
    })

    expect(ascResult.rows.map((r: any) => r.id)).to.deep.equal([2, 3, 1])

    const descResult: any = await taskSearch({
      organizationId: '1',
      sortBy: 'createdAt',
      sortDirection: 'desc',
      limit: '10',
      page: '0'
    })

    expect(descResult.rows.map((r: any) => r.id)).to.deep.equal([1, 3, 2])
  })

  it('applies default status DESC, id DESC ordering when sortBy is omitted', async () => {
    const mockProjects = [
      {
        id: 1,
        Tasks: [
          { id: 5, status: 'open' },
          { id: 10, status: 'closed' }
        ]
      },
      {
        id: 2,
        Tasks: [
          { id: 15, status: 'open' },
          { id: 2, status: 'closed' }
        ]
      }
    ]

    projectFindAllStub.resolves(mockProjects)

    const result: any = await taskSearch({
      organizationId: '1',
      limit: '10',
      page: '0'
    })

    // 'open' > 'closed' in DESC, then id DESC
    expect(result.rows.map((r: any) => r.id)).to.deep.equal([15, 5, 10, 2])
  })

  it('returns all sorted tasks as an array when not paginated', async () => {
    const mockProjects = [
      {
        id: 1,
        Tasks: [
          { id: 1, value: 50 },
          { id: 2, value: 10 }
        ]
      }
    ]

    projectFindAllStub.resolves(mockProjects)

    const result: any = await taskSearch({
      organizationId: '1',
      sortBy: 'value',
      sortDirection: 'asc'
    })

    expect(Array.isArray(result)).to.be.true
    expect(result.map((r: any) => r.id)).to.deep.equal([2, 1])
  })

  it('passes requested sort column and direction to the Task include order', async () => {
    projectFindAllStub.resolves([])

    await taskSearch({
      organizationId: '1',
      sortBy: 'value',
      sortDirection: 'asc',
      limit: '10',
      page: '0'
    })

    expect(projectFindAllStub.calledOnce).to.be.true
    const queryArg = projectFindAllStub.firstCall.args[0]
    expect(queryArg.where).to.deep.equal({ OrganizationId: 1 })

    const taskInclude = queryArg.include.find((inc: any) => inc.model === models.Task)
    expect(taskInclude.order).to.deep.equal([
      ['value', 'ASC'],
      ['id', 'ASC']
    ])
  })

  it('handles projects with empty or undefined tasks safely', async () => {
    const mockProjects = [
      { id: 1, name: 'Empty Project A', Tasks: [] },
      { id: 2, name: 'Project B with Tasks', Tasks: [{ id: 1, value: 100 }] },
      { id: 3, name: 'Project C null tasks' }
    ]

    projectFindAllStub.resolves(mockProjects)

    const result: any = await taskSearch({
      organizationId: '1',
      sortBy: 'value',
      sortDirection: 'asc',
      limit: '10',
      page: '0'
    })

    expect(result.count).to.equal(1)
    expect(result.rows[0].id).to.equal(1)
  })

  it('handles Sequelize model instances with get() and dataValues', async () => {
    const mockProjects = [
      {
        id: 1,
        Tasks: [
          {
            get: (col: string) => (col === 'value' ? '25.00' : col === 'id' ? 1 : undefined),
            dataValues: { id: 1, value: '25.00' }
          },
          {
            get: (col: string) => (col === 'value' ? '5.00' : col === 'id' ? 2 : undefined),
            dataValues: { id: 2, value: '5.00' }
          }
        ]
      }
    ]

    projectFindAllStub.resolves(mockProjects)

    const result: any = await taskSearch({
      organizationId: '1',
      sortBy: 'value',
      sortDirection: 'asc',
      limit: '10',
      page: '0'
    })

    expect(result.rows.map((r: any) => r.dataValues.id)).to.deep.equal([2, 1])
  })

  it('falls back to Task.findAndCountAll when projectId is specified with organizationId', async () => {
    taskFindAndCountAllStub.resolves({ rows: [], count: 0 })

    await taskSearch({
      organizationId: '1',
      projectId: '42',
      limit: '10',
      page: '0'
    })

    expect(projectFindAllStub.called).to.be.false
    expect(taskFindAndCountAllStub.calledOnce).to.be.true
    const queryArg = taskFindAndCountAllStub.firstCall.args[0]
    expect(queryArg.where.ProjectId).to.exist
    const projectInc = queryArg.include.find((inc: any) => inc.model === models.Project)
    expect(projectInc.where).to.deep.equal({ OrganizationId: 1 })
  })
})
