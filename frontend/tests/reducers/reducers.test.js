jest.unmock('react-intl')
import { preferences } from '../../src/reducers/preferencesReducer'

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
        'skills': null
      }
    )
  })
})
