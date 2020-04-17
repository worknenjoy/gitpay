import React from 'react'
import PropTypes from 'prop-types'
import { injectIntl, defineMessages, FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import {
  Chip,
  Avatar,
  Typography
} from '@material-ui/core'

const Content = styled.span`
  margin-top: 5px;
  padding-bottom: 10px;
  color: white;
  text-align: center;
`

const Items = styled.div`
  margin-top: 5px;
`

const ItemBig = styled(Chip)`
  outline: 1px solid orange;
  margin: 10px;
  font-weight: bold;
  width: 170px;
  justify-Content: space-between !important;
`

const ItemSmall = styled(ItemBig)`
  width: 120px;
`

const Icon = styled(Avatar)`
  width: 50px !important;
  font-size: 0.8rem !important;
  border-radius: 16px !important;
`

const messages = defineMessages({
  infoStatusTasks: {
    id: 'info.stats.number.tasks',
    defaultMessage: 'tasks'
  },
  infoStatusBounties: {
    id: 'info.stats.number.bounty',
    defaultMessage: 'paid for bounties'
  },
  infoStatusUsers: {
    id: 'info.stats.number.users',
    defaultMessage: 'users'
  }
})

class Info extends React.Component {
  componentDidMount () {
    this.props.info()
  }
  render () {
    const { tasks, bounties, users, intl } = this.props

    const stats = {
      tasks: { text: intl.formatMessage(messages.infoStatusTasks), value: tasks || '0' },
      bounties: { text: intl.formatMessage(messages.infoStatusBounties), value: '$' + (bounties || '0') },
      users: { text: intl.formatMessage(messages.infoStatusUsers), value: users || '0' }
    }

    return (
      <Content>
        <Typography variant='body1' color='inherit' gutterBottom>
          <FormattedMessage id='info.status.subheading' defaultMessage='Stats' />
        </Typography>
        <Items>
          <ItemSmall label={ stats.tasks.text } avatar={ <Icon children={ stats.tasks.value } /> } />
          <ItemBig label={ stats.bounties.text } avatar={ <Icon children={ stats.bounties.value } /> } />
          <ItemSmall label={ stats.users.text } avatar={ <Icon children={ stats.users.value } /> } />
        </Items>
      </Content>
    )
  }
}

Info.propTypes = {
  info: PropTypes.func.isRequired,
  tasks: PropTypes.any,
  bounties: PropTypes.any,
  users: PropTypes.any
}

export default injectIntl(Info)
