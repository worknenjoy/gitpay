import React from 'react'
import { CardContent, CardHeader, Avatar, Button } from '@mui/material'
import Skeleton from '@mui/material/Skeleton'
import { Card, CardActionsCentered } from './dashboard-card-base.styles'

const DashboardCardBasePlaceholder = () => {
  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: 'text.contrast', width: 48, height: 48 }}>
            <Skeleton variant="circular" width={32} height={32} />
          </Avatar>
        }
        title={<Skeleton width="60%" />}
        subheader={<Skeleton width="40%" />}
      />
      <CardContent>
        <Skeleton variant="rectangular" height={20} />
      </CardContent>
      <CardActionsCentered>
        <Button size="small" color="primary" disabled>
          <Skeleton width={80} />
        </Button>
      </CardActionsCentered>
    </Card>
  )
}

export default DashboardCardBasePlaceholder
