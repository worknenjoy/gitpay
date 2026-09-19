import React from 'react'
import { Button, CardContent, CardActions, Skeleton } from '@mui/material'
import {
  RootCard,
  Header,
  IconWrap,
  Label,
  ValueRow,
  CurrencyPrefix,
  Value,
  Note
} from './stat-card.styles'

export type StatCardProps = {
  icon?: React.ReactNode
  label: React.ReactNode
  value: React.ReactNode
  currency?: React.ReactNode
  note?: React.ReactNode
  onAdd?: (e: any) => void
  action?: React.ReactNode
  actionProps?: any
  completed?: boolean
}

const StatCard = ({
  icon,
  label,
  value,
  currency,
  note,
  onAdd,
  action,
  actionProps,
  completed
}: StatCardProps) => {
  const isLoading = completed === false

  return (
    <RootCard>
      <CardContent>
        {isLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <Skeleton variant="text" animation="wave" height={40} width="60%" />
            <Skeleton variant="rectangular" animation="wave" width="40%" height={100} />
          </div>
        ) : (
          <>
            <Header>
              {icon && <IconWrap>{icon}</IconWrap>}
              <Label>{label}</Label>
            </Header>
            <ValueRow>
              {currency && <CurrencyPrefix>{currency}</CurrencyPrefix>}
              <Value>{value}</Value>
            </ValueRow>
            {note && <Note>{note}</Note>}
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
    </RootCard>
  )
}

export default StatCard
