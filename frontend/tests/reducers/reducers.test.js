/**
 * @jest-environment jsdom
 */
import { preferences } from '../../src/reducers/preferencesReducer'
import { organizations } from '../../src/reducers/organizationsReducer'
import { task } from '../../src/reducers/taskReducer'
import { contact } from '../../src/reducers/contactReducer'
import { userProfileStats } from '../../src/reducers/userProfileStatsReducer'
import { paymentLinksPublic } from '../../src/reducers/paymentLinksPublicReducer'
import { maintainedProjects } from '../../src/reducers/maintainedProjectsReducer'

xdescribe('task reducer', () => {
  it('should return the initial state', () => {
    expect(task(undefined, {})).toEqual({
      completed: false,
      data: {
        assignedUser: {},
        assigns: [],
        metadata: {
          company: '',
          issue: {
            body: '',
            state: 'open',
            user: {
              avatar_url: 'https://loading.io/spinners/disqus/index.discuss-messesage-preloader.svg'
            }
          }
        },
        orders: [],
        provider: null,
        url: '',
        value: 0
      },
      error: { message: false },
      filterOrdersBy: {},
      tab: 0,
      values: { available: 0, card: 0, failed: 0, paypal: 0, pending: 0, transferred: 0 }
    })
  })
})

describe('preferences reducer', () => {
  it('should return the initial state', () => {
    expect(preferences(undefined, {})).toEqual({
      completed: true,
      country: null,
      error: {},
      language: null,
      languages: null,
      os: null,
      receiveNotifications: null,
      openForJobs: null,
      skills: null
    })
  })
})

describe('organizations reducer', () => {
  it('should return the initial state', () => {
    expect(organizations(undefined, {})).toEqual({
      completed: true,
      data: [],
      error: {}
    })
  })
})

describe('contact reducer', () => {
  it('should return the initial state', () => {
    expect(contact(undefined, {})).toEqual({ completed: true })
  })
})

describe('userProfileStats reducer', () => {
  it('should return the initial state', () => {
    expect(userProfileStats(undefined, {})).toEqual({
      completed: true,
      data: {},
      error: {}
    })
  })

  it('should handle GET_USER_PROFILE_STATS_SUCCESS', () => {
    const stats = { contributor: { issuesSolvedCount: 3 } }
    expect(
      userProfileStats(undefined, { type: 'GET_USER_PROFILE_STATS_SUCCESS', data: stats })
    ).toEqual({
      completed: true,
      data: stats,
      error: {}
    })
  })
})

describe('paymentLinksPublic reducer', () => {
  it('should return the initial state', () => {
    expect(paymentLinksPublic(undefined, {})).toEqual({
      completed: true,
      data: [],
      error: {}
    })
  })

  it('should handle GET_PUBLIC_PAYMENT_LINKS_SUCCESS', () => {
    const links = [{ id: 1, title: 'Code review' }]
    expect(
      paymentLinksPublic(undefined, { type: 'GET_PUBLIC_PAYMENT_LINKS_SUCCESS', data: links })
    ).toEqual({
      completed: true,
      data: links,
      error: {}
    })
  })
})

describe('maintainedProjects reducer', () => {
  it('should return the initial state', () => {
    expect(maintainedProjects(undefined, {})).toEqual({
      completed: true,
      data: [],
      error: {}
    })
  })

  it('should handle GET_MAINTAINED_PROJECTS_SUCCESS', () => {
    const projects = [{ id: 1, name: 'gitpay' }]
    expect(
      maintainedProjects(undefined, { type: 'GET_MAINTAINED_PROJECTS_SUCCESS', data: projects })
    ).toEqual({
      completed: true,
      data: projects,
      error: {}
    })
  })
})
