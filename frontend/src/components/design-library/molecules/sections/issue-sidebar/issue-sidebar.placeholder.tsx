import React from 'react'
import { Typography, Skeleton } from '@mui/material'
import {
  SidebarRoot,
  SidebarSection,
  SidebarItem,
  TaskInfoContent,
  StatusChip,
  StatusAvatarDot
} from './issue-sidebar.styles'

const IssueSidebarPlaceholder = () => {
  return (
    <SidebarRoot aria-busy="true" aria-label="Issue sidebar loading">
      <div style={{ textAlign: 'center', marginTop: 10 }}>
        <Typography variant="caption" style={{ textTransform: 'uppercase' }}>
          Value offered
        </Typography>
        <Typography variant="h5" component="div" justifyContent="center" display="flex">
          <Skeleton width={120} />
        </Typography>
      </div>

      <SidebarSection>
        <SidebarItem>
          <Typography variant="caption" style={{ textTransform: 'uppercase' }}>
            Publicy
          </Typography>
          <div>
            <Skeleton width={80} height={24} />
          </div>
        </SidebarItem>

        <SidebarItem>
          <Typography variant="caption" style={{ textTransform: 'uppercase' }}>
            Status
          </Typography>
          <div>
            <StatusChip
              status="open"
              label={<Skeleton width={60} />}
              avatar={<StatusAvatarDot status="open" />}
            />
          </div>
        </SidebarItem>
      </SidebarSection>

      <SidebarSection>
        <SidebarItem>
          <Typography variant="caption" style={{ textTransform: 'uppercase' }}>
            Level
          </Typography>
          <div>
            <Typography variant="h6" component="span" sx={{ verticalAlign: 'baseline', ml: 1 }}>
              <TaskInfoContent>
                <Skeleton width={100} />
              </TaskInfoContent>
            </Typography>
          </div>
        </SidebarItem>

        <SidebarItem>
          <Typography variant="caption" style={{ textTransform: 'uppercase' }}>
            Deadline
          </Typography>
          <div>
            <Typography variant="h6">
              <Skeleton width={160} />
            </Typography>
          </div>
        </SidebarItem>
      </SidebarSection>

      <SidebarSection>
        <SidebarItem>
          <Skeleton variant="rectangular" width={220} height={38} />
        </SidebarItem>
        <SidebarItem>
          <Skeleton variant="rectangular" width={220} height={38} />
        </SidebarItem>
      </SidebarSection>

      <div>
        <Skeleton variant="rectangular" height={180} />
      </div>
    </SidebarRoot>
  )
}

export default IssueSidebarPlaceholder
