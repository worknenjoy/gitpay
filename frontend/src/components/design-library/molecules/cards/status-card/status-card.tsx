import React from 'react'
import { Button, Card, CardContent, CardActions, Typography, styled, Skeleton } from '@mui/material'

const Root = styled(Card)(() => ({
  maxWidth: 500,
  margin: 10,
  textAlign: 'right',
  padding: 10
}))

const Balance = styled(Typography)(() => ({
  fontSize: 32,
  fontWeight: 'bold'
}))

const Name = styled(Typography)(() => ({
  fontSize: 18
}))

const Sub = styled(Typography)(() => ({
  fontSize: 13
}))

type StatusCardProps = {
  name: string | React.ReactNode
  /** Display value: schedule interval, label, or custom node (e.g. FormattedMessage) */
  status: string | number | React.ReactNode
  /** Optional secondary line under the value, e.g. "3 active · 1 archived" or "↑ 14% YoY" */
  sub?: React.ReactNode
  onAdd?: (e: any) => void
  action?: React.PropsWithChildren<any>
  actionProps?: any
  completed?: boolean
}

const StatusCard = ({
  name,
  status,
  sub,
  onAdd,
  action,
  actionProps,
  completed
}: StatusCardProps) => {
  return (
    <Root>
      <CardContent>
        {!completed ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <Skeleton variant="text" animation="wave" width="60%" height={40} />
            <Skeleton variant="text" animation="wave" width="40%" height={100} />
          </div>
        ) : (
          <>
            <Name color="textSecondary" gutterBottom>
              {name}
            </Name>
            <Balance color="primary">{status}</Balance>
            {sub && (
              <Sub color="textSecondary" gutterBottom>
                {sub}
              </Sub>
            )}
          </>
        )}
      </CardContent>
      {onAdd && action && (
        <CardActions style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            size="small"
            color="secondary"
            onClick={onAdd}
            {...actionProps}
          >
            {action}
          </Button>
        </CardActions>
      )}
    </Root>
  )
}

export default StatusCard
