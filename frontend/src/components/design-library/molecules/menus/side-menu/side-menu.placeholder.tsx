import React from 'react'
import { Skeleton, Stack } from '@mui/material'

const SidebarMenuPlaceholder: React.FC = () => {
  // Use deterministic widths to avoid SSR hydration mismatches
  const widths = [92, 86, 98, 90, 94, 88, 96, 84]

  return (
    <Stack spacing={1} sx={{ p: 1 }}>
      {widths.map((w, i) => (
        <Skeleton
          key={i}
          variant="text"
          animation="wave"
          height={24}
          width={`${w}%`}
          color="inherit"
        />
      ))}
    </Stack>
  )
}

export default SidebarMenuPlaceholder
