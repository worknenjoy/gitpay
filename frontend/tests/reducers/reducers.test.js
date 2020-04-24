jest.unmock('react-intl')
import { preferences } from '../../src/reducers/preferencesReducer'
import { organizations } from '../../src/reducers/organizationsReducer'

describe('preferences reducer', () => {
  it('should return the initial state', () => {
    expect(preferences(undefined, {})).toEqual(
      {
        'completed': true,
        'country': null,
        'error': {},
        'language': null,
        'languages': null,
        'os': null,
        'receiveNotifications': null,
        'openForJobs': null,
        'skills': null
      }
    )
  })
})

describe('organizations reducer', () => {
  it('should return the initial state', () => {
    expect(organizations(undefined, {})).toEqual(
      {
        'completed': true,
        'organizations': [],
        'error': {}
      }
    )
  })
})
