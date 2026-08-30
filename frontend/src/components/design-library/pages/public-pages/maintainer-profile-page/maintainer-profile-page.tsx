import React from 'react'
import { Container, Divider, Grid } from '@mui/material'
import { FormattedMessage, FormattedNumber } from 'react-intl'
import ProfileUserHeader from 'design-library/molecules/headers/profile-user-header/profile-user-header'
import StatusCard from 'design-library/molecules/cards/status-card/status-card'
import ProjectSummaryCard from 'design-library/molecules/cards/project-summary-card/project-summary-card'
import TaskDetailDrawer from 'design-library/molecules/drawers/task-detail-drawer/task-detail-drawer'
import SectionTable from 'design-library/molecules/tables/section-table/section-table'
import {
  useIssueMetadata,
  useIssueColumnRenderer
} from 'design-library/molecules/tables/issue-table/issue-table'
import { Page } from '../../../../../styleguide/components/Page'
import { Root, StatsRow } from './maintainer-profile-page.styles'

type MaintainedProject = {
  id: number | string
  name: string
  repo?: string
  description?: string
  org?: string
  organizationId?: number | string
  openBountyCount?: number
  totalPaid?: number
  issuesCount?: number
}

type MaintainerProfilePageProps = {
  profile: any
  stats?: {
    projectsMaintainedCount?: number
    totalFundedForProjects?: number
    openBountiesCount?: number
    contributorsCount?: number
    maintainingSince?: string
  }
  /** Whether `stats` has finished loading — controls the stat tiles' skeleton state. */
  statsCompleted?: boolean
  projects: MaintainedProject[]
  bounties: { data: any[]; completed: boolean; totalCount?: number }
  serverSidePagination?: any
}

const MaintainerProfilePage = ({
  profile,
  stats = {},
  statsCompleted = true,
  projects,
  bounties,
  serverSidePagination
}: MaintainerProfilePageProps) => {
  const [openTask, setOpenTask] = React.useState<any>(null)
  const issueMetadata = useIssueMetadata({ includeProject: true, includeActions: true })
  const columnRenderer = useIssueColumnRenderer({ onViewDetails: setOpenTask })

  return (
    <React.Fragment>
      <Page>
        <Container fixed maxWidth="lg">
          <ProfileUserHeader
            profile={profile}
            roles={[{ name: 'maintainer', tone: 'teal', active: true }]}
            cta={[
              {
                label: (
                  <FormattedMessage
                    id="maintainerProfile.sponsorProjects"
                    defaultMessage="Sponsor projects →"
                  />
                )
              },
              {
                label: (
                  <FormattedMessage
                    id="maintainerProfile.viewBounties"
                    defaultMessage="View bounties"
                  />
                ),
                variant: 'outlined'
              }
            ]}
            meta={{
              identity: [
                stats.maintainingSince && (
                  <FormattedMessage
                    key="since"
                    id="maintainerProfile.maintainingSince"
                    defaultMessage="Maintaining since {year}"
                    values={{ year: new Date(stats.maintainingSince).getFullYear() }}
                  />
                ),
                stats.projectsMaintainedCount != null && (
                  <FormattedMessage
                    key="active"
                    id="maintainerProfile.activeProjects"
                    defaultMessage="{count} active projects"
                    values={{ count: stats.projectsMaintainedCount }}
                  />
                )
              ].filter(Boolean),
              context: [
                stats.contributorsCount != null && (
                  <FormattedMessage
                    key="contributors"
                    id="maintainerProfile.contributorsAcrossRepos"
                    defaultMessage="{count} contributors across repos"
                    values={{ count: stats.contributorsCount }}
                  />
                ),
                stats.totalFundedForProjects != null && (
                  <FormattedMessage
                    key="paidOut"
                    id="maintainerProfile.paidOut"
                    defaultMessage="{amount} paid out"
                    values={{
                      amount: (
                        <FormattedNumber
                          value={stats.totalFundedForProjects}
                          style="currency"
                          currency="USD"
                          maximumFractionDigits={0}
                        />
                      )
                    }}
                  />
                )
              ].filter(Boolean)
            }}
          />
        </Container>

        <Container fixed maxWidth="lg">
          <Root container>
            <StatsRow>
              <StatusCard
                completed={statsCompleted}
                name={
                  <FormattedMessage
                    id="maintainerProfile.stat.projects"
                    defaultMessage="Projects maintained"
                  />
                }
                status={stats.projectsMaintainedCount ?? '—'}
              />
              <StatusCard
                completed={statsCompleted}
                name={
                  <FormattedMessage
                    id="maintainerProfile.stat.funded"
                    defaultMessage="Total funded"
                  />
                }
                status={
                  <FormattedNumber
                    value={stats.totalFundedForProjects ?? 0}
                    style="currency"
                    currency="USD"
                    maximumFractionDigits={0}
                  />
                }
              />
              <StatusCard
                completed={statsCompleted}
                name={
                  <FormattedMessage
                    id="maintainerProfile.stat.openBounties"
                    defaultMessage="Open bounties"
                  />
                }
                status={stats.openBountiesCount ?? '—'}
              />
              <StatusCard
                completed={statsCompleted}
                name={
                  <FormattedMessage
                    id="maintainerProfile.stat.contributors"
                    defaultMessage="Contributors"
                  />
                }
                status={stats.contributorsCount ?? '—'}
              />
            </StatsRow>

            <Divider textAlign="left">
              <FormattedMessage id="maintainerProfile.projects" defaultMessage="Projects" />
            </Divider>
            <Grid container spacing={2} sx={{ mt: 0.5, mb: 3 }}>
              {projects.map((project) => (
                <Grid key={project.id} size={{ xs: 12, sm: 6 }}>
                  <ProjectSummaryCard
                    project={{
                      ...project,
                      orgUrl: project.organizationId
                        ? `#/organizations/${project.organizationId}`
                        : undefined,
                      projectUrl:
                        project.organizationId != null
                          ? `#/organizations/${project.organizationId}/projects/${project.id}`
                          : undefined
                    }}
                  />
                </Grid>
              ))}
            </Grid>

            <Divider textAlign="left">
              <FormattedMessage
                id="maintainerProfile.openBounties"
                defaultMessage="Open bounties · accepting work"
              />
            </Divider>
            <SectionTable
              transparent
              tableData={bounties}
              tableHeaderMetadata={issueMetadata}
              customColumnRenderer={columnRenderer}
              serverSidePagination={serverSidePagination}
            />
          </Root>
        </Container>
      </Page>
      <TaskDetailDrawer task={openTask} open={!!openTask} onClose={() => setOpenTask(null)} />
    </React.Fragment>
  )
}

export default MaintainerProfilePage
