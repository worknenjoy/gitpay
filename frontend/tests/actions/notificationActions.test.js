/**
 * @jest-environment jsdom
 */
import configureMockStore from 'redux-mock-store'
import { thunk } from 'redux-thunk'
import * as actions from '../../src/actions/notificationActions'
import * as types from '../../src/actions/notificationActions'
import { expect } from 'chai'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('Notification Actions', () => {
  it('should create an action to add a notification', () => {
    const message = 'Test message'
    const extra = 'Extra info'
    const link = 'http://example.com'
    const expectedAction = {
      type: types.ADD_NOTIFICATION,
      text: `${message} - ${extra}`,
      open: true,
      link: link,
      severity: undefined
    }

    const store = mockStore({ intl: { messages: { [message]: message } } })
    store.dispatch(actions.addNotification(message, {extra, link} ))
    const actionsDispatched = store.getActions()
    expect(actionsDispatched[0]).to.deep.equal(expectedAction)
  })

  it('should create an action to close a notification', () => {
    const expectedAction = {
      type: types.CLOSE_NOTIFICATION,
      open: false
    }
    expect(actions.closeNotification()).to.deep.equal(expectedAction)
  })

  it('should create an action to add a dialog', () => {
    const target = 'Test target'
    const expectedAction = {
      type: types.ADD_DIALOG,
      dialog: true,
      target: target
    }
    expect(actions.addDialog(target)).to.deep.equal(expectedAction)
  })

  it('should create an action to close a dialog', () => {
    const expectedAction = {
      type: types.CLOSE_DIALOG,
      dialog: false,
      target: null
    }
    expect(actions.closeDialog()).to.deep.equal(expectedAction)
  })
})
