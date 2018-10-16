import React from 'react'
const Intl = jest.genMockFromModule('react-intl')

const intl = {
  formatMessage: ({ defaultMessage }) => defaultMessage
}

Intl.injectIntl = (Node) => (props) => <Node { ...props } intl={ intl } />

module.exports = Intl
