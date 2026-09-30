import React from 'react'
import { createStore, applyMiddleware } from 'redux'
import { thunk } from 'redux-thunk'
import { Provider } from 'react-redux'
import reducers from '../../src/reducers/reducers'

// A minimal store built from the app's real root reducer (frontend/src/reducers/reducers.ts)
// so every slice gets its normal default state — needed for stories that render a
// Redux-connected container directly (e.g. containers/payment/import-pull-request), which
// otherwise throws "Could not find 'store' in the context of ..." since Storybook has no
// app-level <Provider> of its own.
const store = createStore(reducers, applyMiddleware(thunk))

export const withReduxStore = (Story: any) => (
  <Provider store={store}>
    <Story />
  </Provider>
)
