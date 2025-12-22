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
import { FormattedMessage } from 'react-intl'

const IssueSidebarPlaceholder = () => {
  return (
    <SidebarRoot aria-busy="true" aria-label="Issue sidebar loading">
      <div style={{ textAlign: 'center', marginTop: 10 }}>
        <Typography variant="caption" style={{ textTransform: 'uppercase' }}>
          <FormattedMessage id="task.value.label" defaultMessage="Value offered" />
        </Typography>
        <Typography variant="h5" component="div" justifyContent="center" display="flex">
          <Skeleton width={120} />
        </Typography>
      </div>

      <SidebarSection>
        <SidebarItem>
          <Typography variant="caption" style={{ textTransform: 'uppercase' }}>
            <FormattedMessage id="task.publicy.label" defaultMessage="Publicy" />
          </Typography>
          <div>
            <Skeleton width={80} height={24} />
          </div>
        </SidebarItem>

        <SidebarItem>
          <Typography variant="caption" style={{ textTransform: 'uppercase' }}>
            <FormattedMessage id="task.status.label" defaultMessage="Status" />
          </Typography>
          <div>
            <StatusChip
              status="open"
              label={<Skeleton width={60} />}
              avatar={<Skeleton width={12} height={12} variant="circular" />}
            />
          </div>
        </SidebarItem>
      </SidebarSection>

      <SidebarSection>
        <SidebarItem>
          <Typography variant="caption" style={{ textTransform: 'uppercase' }}>
            <FormattedMessage id="task.level.label" defaultMessage="Level" />
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
            <FormattedMessage id="task.deadline.label" defaultMessage="Deadline" />
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
          <Skeleton variant="rectangular" width={320} height={38} style={{marginBottom: 20}} />
          <Skeleton variant="rectangular" width={320} height={38} />
        </SidebarItem>
      </SidebarSection>

      <div>
        <Skeleton variant="rectangular" height={180} />
      </div>
    </SidebarRoot>
  )
}

export default IssueSidebarPlaceholder
