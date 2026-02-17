import React from 'react'
import { Card, CardContent, Divider, List, ListItem, Skeleton, Stack } from '@mui/material'

type Props = {
  items?: number
}

export default function BankAccountListPlaceholder({ items = 3 }: Props) {
  return (
    <Card elevation={0} sx={{ width: '100%' }}>
      <CardContent>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
          <Skeleton variant="text" width={160} />
          <Skeleton variant="text" width={60} />
        </Stack>

        <Divider sx={{ mb: 1 }} />

        <List disablePadding>
          {Array.from({ length: items }).map((_, index) => (
            <React.Fragment key={index}>
              <ListItem sx={{ py: 1.5 }}>
                <Stack spacing={1} sx={{ width: '100%' }}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Skeleton variant="text" width="35%" />
                    <Skeleton variant="rounded" width={70} height={22} />
                  </Stack>
                  <Skeleton variant="text" width="55%" />
                  <Skeleton variant="text" width="40%" />
                </Stack>
              </ListItem>
              {index < items - 1 ? <Divider /> : null}
            </React.Fragment>
          ))}
        </List>
      </CardContent>
    </Card>
  )
}
