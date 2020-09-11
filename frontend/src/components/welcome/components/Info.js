import React from 'react'
import PropTypes from 'prop-types'
import { injectIntl, FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import {
  Typography
} from '@material-ui/core'

const Content = styled.span`
  margin-top: 5px;
  padding-bottom: 10px;
  color: white;
  text-align: center;
`

class Info extends React.Component {
  componentDidMount () {
    this.props.info()
  }
  render () {
    const { tasks, bounties, users } = this.props

    const stats = {
      tasks: { value: tasks || '0' },
      bounties: { value: '$' + (bounties || '0') },
      users: { value: users || '0' }
    }

    return (
      <Content>
        <Typography variant='body1' color='primary' gutterBottom>
          <FormattedMessage id='info.status.message' defaultMessage='We paid {bounties} USD in bounties and freelancer work for {tasks} tasks to our community of {users} users' values={ {
            tasks: stats.tasks.value,
            bounties: stats.bounties.value,
            users: stats.users.value
          } } />
        </Typography>
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
