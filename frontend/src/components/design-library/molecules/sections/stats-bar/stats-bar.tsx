import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Chip, Skeleton, Typography } from '@mui/material'

const Content = styled.span`
  margin-top: 5px;
  padding-bottom: 10px;
  color: white;
  text-align: left;
  display: inline-block;
`

const StatsBar = ({ getInfo, tasks, bounties, users, completed }) => {
  useEffect(() => {
    getInfo?.()
  }, [])

  const stats = {
    tasks: { value: tasks || '0' },
    bounties: { value: '$' + (bounties || '0') },
    users: { value: users || '0' }
  }

  return (
    <Content>
      <Typography variant="body1" color="primary" gutterBottom>
        <FormattedMessage
          id="info.status.message"
          defaultMessage="We paid {bounties} in bounties and freelancer work for {tasks} to our community of {users}"
          values={{
            tasks: (
              <Chip
                size="small"
                label={
                  completed ?
                  <FormattedMessage
                    id="info.status.tasks"
                    defaultMessage="{tasks} tasks"
                    values={{
                      tasks: stats.tasks.value
                    }} /> : <Skeleton width={50} height={20} />
                }
              />
            ),
            bounties: <Chip size="small" label={ completed ? stats.bounties.value : <Skeleton width={50} height={20} /> } />,
            users: (
              <Chip
                size="small"
                label={
                  completed ?
                  <FormattedMessage
                    id="info.status.users"
                    defaultMessage="{users} users"
                    values={{
                      users: stats.users.value
                    }} /> : <Skeleton width={50} height={20} />
                }
              />
            )
          }}
        />
      </Typography>
    </Content>
  )
}

export default StatsBar
