import React from 'react'
const Intl = jest.requireActual('react-intl')

const intl = {
  formatMessage: ({ defaultMessage }) => defaultMessage,
  defineMessages: (messages) => messages
}

Intl.injectIntl = (Node) => (props) => <Node {...props} intl={intl} />

module.exports = Intl
