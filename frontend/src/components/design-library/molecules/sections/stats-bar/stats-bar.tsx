import React, { useEffect } from 'react'
import { FormattedMessage, FormattedNumber } from 'react-intl'
import styled from 'styled-components'

import { Chip, Skeleton, Typography } from '@mui/material'

const Content = styled.span`
  margin-top: 5px;
  padding-bottom: 10px;
  color: white;
  text-align: left;
  display: inline-block;
`

const Separator = styled.span`
  margin: 0 10px;
  font-size: 1.2em;
  font-weight: bold;
  opacity: 0.9;
  vertical-align: middle;
`

const StatChip = ({ completed, value }: { completed: boolean; value: React.ReactNode }) => (
  <Chip size="small" label={completed ? value : <Skeleton width={50} height={20} />} />
)

const StatsBar = ({ getInfo, totalPaid, workCount, users, countries, completed }) => {
  useEffect(() => {
    getInfo?.()
  }, [])

  return (
    <Content>
      <Typography variant="body1" color="primary" gutterBottom>
        <StatChip
          completed={completed}
          value={
            <FormattedMessage
              id="info.status.total_paid"
              defaultMessage="${amount}"
              values={{ amount: <FormattedNumber value={totalPaid || 0} /> }}
            />
          }
        />{' '}
        <FormattedMessage
          id="info.status.paid_for_work"
          defaultMessage="paid for work through Gitpay"
        />
        <Separator>•</Separator>
        <StatChip completed={completed} value={<FormattedNumber value={workCount || 0} />} />{' '}
        <FormattedMessage
          id="info.status.bounties_and_requests"
          defaultMessage="bounties and payment requests"
        />
        <Separator>•</Separator>
        <StatChip completed={completed} value={<FormattedNumber value={users || 0} />} />{' '}
        <FormattedMessage
          id="info.status.users"
          defaultMessage="users"
          values={{ count: users || 0 }}
        />
        <Separator>•</Separator>
        <StatChip completed={completed} value={<FormattedNumber value={countries || 0} />} />{' '}
        <FormattedMessage
          id="info.status.countries"
          defaultMessage="countries"
          values={{ count: countries || 0 }}
        />
      </Typography>
    </Content>
  )
}

export default StatsBar
