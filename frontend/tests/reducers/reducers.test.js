/**
 * @jest-environment jsdom
 */
import { preferences } from '../../src/reducers/preferencesReducer'
import { organizations } from '../../src/reducers/organizationsReducer'
import { task } from '../../src/reducers/taskReducer'
import { contact } from '../../src/reducers/contactReducer'

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
