/**
 * @jest-environment jsdom
 */
import configureMockStore from 'redux-mock-store'
import { thunk } from 'redux-thunk'
import moxios from 'moxios'
import * as contactActions from '../../src/actions/contactActions'
import Auth from '../../src/modules/auth'

Auth.getToken = () => true

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('recruitment landing page actions', () => {
  describe('message recruiters', () => {
    it('should dispatch an action to send message to recruitment team', () => {
      expect(contactActions.messageRecruitersRequested()).toEqual({
        type: 'MESSAGE_RECRUITERS_REQUESTED',
        completed: false,
      })
      expect(contactActions.messageRecruitersSuccess()).toEqual({
        type: 'MESSAGE_RECRUITERS_SUCCESS',
        completed: true,
      })
      expect(contactActions.messageRecruitersError({ code: 401 })).toEqual({
        type: 'MESSAGE_RECRUITERS_ERROR',
        completed: true,
        error: { code: 401 },
      })
    })
    it('should dispatch an action to send message to recruiters async', () => {
      moxios.install()
      moxios.wait(() => {
        const request = moxios.requests.mostRecent()
        request.respondWith({
          status: 200,
          response: {},
        })
      })
      const expectedActions = [
        { completed: false, type: 'MESSAGE_RECRUITERS_REQUESTED' },
        { open: true, text: 'actions.message.recruiters.success', type: 'ADD_NOTIFICATION' },
        { completed: true, type: 'MESSAGE_RECRUITERS_SUCCESS' },
      ]
      const store = mockStore({ intl: { messages: {} } })
      return store
        .dispatch(
          contactActions.messageRecruiters(
            'name',
            'title',
            'email',
            'phone',
            'company',
            'country',
            'message',
          ),
        )
        .then(() => {
          // return of async actions
          expect(store.getActions()).toEqual(expectedActions)
          moxios.uninstall()
        })
    })
  })
})
