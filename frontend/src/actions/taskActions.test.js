import configureMockStore from 'redux-mock-store'
import { thunk } from 'redux-thunk'
import moxios from 'moxios'
import {
  listMaintainerOpenBounties,
  LIST_MAINTAINER_OPEN_BOUNTIES_REQUESTED,
  LIST_MAINTAINER_OPEN_BOUNTIES_SUCCESS,
  LIST_MAINTAINER_OPEN_BOUNTIES_ERROR
} from './taskActions'

const mockStore = configureMockStore([thunk])

// Only `listMaintainerOpenBounties` is covered here — it's the new action
// introduced for the Maintainer profile; the rest of this file's actions
// (listTasks, etc.) have no existing test coverage and are out of scope.
describe('listMaintainerOpenBounties', () => {
  beforeEach(() => {
    moxios.install()
  })

  afterEach(() => {
    moxios.uninstall()
  })

  it('requests open bounties scoped to the given organizationId and dispatches REQUESTED then SUCCESS', (done) => {
    const store = mockStore({})
    const bounties = [
      { id: 1, title: 'Server side rendering for /explore', status: 'open', value: 200 }
    ]

    moxios.wait(() => {
      const request = moxios.requests.mostRecent()
      expect(request.url).toContain('/tasks/list')
      expect(request.config.params).toEqual({ organizationId: 9, status: 'open' })
      request
        .respondWith({
          status: 200,
          response: bounties
        })
        .then(() => {
          const actions = store.getActions()
          expect(actions[0]).toEqual({
            type: LIST_MAINTAINER_OPEN_BOUNTIES_REQUESTED,
            completed: false
          })
          expect(actions[1]).toEqual({
            type: LIST_MAINTAINER_OPEN_BOUNTIES_SUCCESS,
            completed: true,
            data: bounties
          })
          done()
        })
    })

    store.dispatch(listMaintainerOpenBounties(9))
  })

  it('dispatches REQUESTED then ERROR when the request fails', (done) => {
    const store = mockStore({})

    moxios.wait(() => {
      const request = moxios.requests.mostRecent()
      request.respondWith({ status: 500, response: { message: 'boom' } }).then(() => {
        const actions = store.getActions()
        expect(actions[0].type).toBe(LIST_MAINTAINER_OPEN_BOUNTIES_REQUESTED)
        expect(actions[1].type).toBe(LIST_MAINTAINER_OPEN_BOUNTIES_ERROR)
        done()
      })
    })

    store.dispatch(listMaintainerOpenBounties(9))
  })
})
