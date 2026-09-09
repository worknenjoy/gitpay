import React from 'react'
import { Skeleton } from '@mui/material'
import { Row } from './payment-links-list.styles'

const PaymentLinksListPlaceholder = ({ rows = 3 }: { rows?: number }) => (
  <>
    {[...Array(rows)].map((_, index) => (
      <Row key={index}>
        <div>
          <Skeleton variant="text" width={220} height={20} />
          <Skeleton variant="text" width={160} height={16} />
        </div>
        <Skeleton variant="text" width={56} height={20} />
        <Skeleton variant="text" width={40} height={20} />
        <Skeleton variant="rectangular" width={64} height={32} sx={{ borderRadius: 999 }} />
      </Row>
    ))}
  </>
)

export default PaymentLinksListPlaceholder
