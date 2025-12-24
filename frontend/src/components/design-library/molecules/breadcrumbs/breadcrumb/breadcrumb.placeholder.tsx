import React from 'react'
import { Breadcrumbs, Skeleton } from '@mui/material'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import { BreadcrumbRoot } from './breadcrumb.styles'

const BreadcrumbPlaceholder: React.FC = () => {
  return (
    <BreadcrumbRoot>
      <Breadcrumbs aria-label="breadcrumb" separator={<NavigateNextIcon />}>
        <Skeleton variant="text" width={80} height={24} />
        <Skeleton variant="text" width={100} height={24} />
        <Skeleton variant="text" width={120} height={24} />
      </Breadcrumbs>
    </BreadcrumbRoot>
  )
}

export default BreadcrumbPlaceholder