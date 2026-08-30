import React from 'react'
import { Container, Divider, Grid } from '@mui/material'
import { FormattedMessage, FormattedNumber } from 'react-intl'
import ProfileUserHeader from 'design-library/molecules/headers/profile-user-header/profile-user-header'
import PillTabs from 'design-library/molecules/tabs/pill-tabs/pill-tabs'
import StatusCard from 'design-library/molecules/cards/status-card/status-card'
import ProjectSummaryCard from 'design-library/molecules/cards/project-summary-card/project-summary-card'
import PaymentLinkItem, {
  PaymentLink
} from 'design-library/molecules/lists/payment-link-item/payment-link-item'
import TaskDetailDrawer from 'design-library/molecules/drawers/task-detail-drawer/task-detail-drawer'
import SectionTable from 'design-library/molecules/tables/section-table/section-table'
import {
  useIssueMetadata,
  useIssueColumnRenderer
} from 'design-library/molecules/tables/issue-table/issue-table'
import SponsoredProjectsTable, {
  SponsoredProjectRow
} from 'design-library/molecules/tables/sponsored-projects-table/sponsored-projects-table'
import { Page } from '../../../../../styleguide/components/Page'
import { Root, SwitcherRow, StatsRow } from './combined-profile-page.styles'

export type CombinedRole = 'overview' | 'contributor' | 'maintainer' | 'provider' | 'funding'

const buildSponsoredProjectRows = (
  tasks: any[],
  sponsorId: number | string
): SponsoredProjectRow[] => {
  const byProject = new Map<string, SponsoredProjectRow>()
  tasks.forEach((task) => {
    const project = task.Project
    if (!project) return
    const myOrders = (task.Orders || []).filter(
      (o: any) => String(o.userId) === String(sponsorId) && o.status === 'succeeded'
    )
    if (myOrders.length === 0) return
    const key = String(project.id)
    const amount = myOrders.reduce((s: number, o: any) => s + Number(o.amount || 0), 0)
    const lastFundedAt = myOrders.reduce(
      (max: string, o: any) => (new Date(o.createdAt) > new Date(max) ? o.createdAt : max),
      myOrders[0].createdAt
    )
    const existing = byProject.get(key)
    if (existing) {
      existing.amount += amount
      existing.bountiesCount += 1
      if (new Date(lastFundedAt) > new Date(existing.lastFundedAt))
        existing.lastFundedAt = lastFundedAt
    } else {
      byProject.set(key, {
        id: project.id,
        project: project.repo || project.name,
        amount,
        bountiesCount: 1,
        lastFundedAt
      })
    }
  })
  return Array.from(byProject.values())
}

type CombinedProfilePageProps = {
  profile: any
  stats?: {
    contributor?: {
      issuesSolvedCount?: number
      issuesSponsoredCount?: number
      totalEarned?: number
    }
    maintainer?: {
      projectsMaintainedCount?: number
      totalFundedForProjects?: number
      openBountiesCount?: number
      contributorsCount?: number
    }
    provider?: { jobsDeliveredCount?: number; totalReceived?: number }
    funding?: {
      projectsSponsoredCount?: number
      totalFunded?: number
      bountiesPlacedCount?: number
    }
  }
  /** Whether `stats` has finished loading — controls the stat tiles' skeleton state. */
  statsCompleted?: boolean
  projects: any[]
  paymentLinks: Array<PaymentLink & { description?: string; tier?: string | null }>
  issues: { data: any[]; completed: boolean; totalCount?: number }
  serverSidePagination?: any
  activeRole?: CombinedRole
  onRoleChange: (role: CombinedRole) => void
}

const CombinedProfilePage = ({
  profile,
  stats = {},
  statsCompleted = true,
  projects,
  paymentLinks,
  issues,
  serverSidePagination,
  activeRole = 'overview',
  onRoleChange
}: CombinedProfilePageProps) => {
  const [openTask, setOpenTask] = React.useState<any>(null)
  const issueMetadata = useIssueMetadata({ includeProject: true, includeActions: true })
  const columnRenderer = useIssueColumnRenderer({ onViewDetails: setOpenTask })

  const contributorStats = stats.contributor || {}
  const maintainerStats = stats.maintainer || {}
  const providerStats = stats.provider || {}
  const fundingStats = stats.funding || {}

  const lifetimeEarned = (contributorStats.totalEarned || 0) + (providerStats.totalReceived || 0)
  const links = paymentLinks.filter((l) => !l.tier)

  const handleRoleChange = (_e: any, value: CombinedRole) => onRoleChange(value)

  return (
    <React.Fragment>
      <Page>
        <Container fixed maxWidth="lg">
          <ProfileUserHeader
            profile={profile}
            roles={[
              { name: 'contributor', tone: 'orange', active: true },
              { name: 'maintainer', tone: 'teal', active: true },
              { name: 'provider', tone: 'yellow', active: true },
              { name: 'funding', tone: 'pink', active: true }
            ]}
            cta={[
              {
                label: <FormattedMessage id="combinedProfile.hireMe" defaultMessage="Hire me →" />
              },
              {
                label: <FormattedMessage id="combinedProfile.sponsor" defaultMessage="Sponsor" />,
                variant: 'outlined'
              }
            ]}
            meta={{
              identity: [
                <FormattedMessage
                  key="allRoles"
                  id="combinedProfile.allRoles"
                  defaultMessage="All roles enabled"
                />
              ],
              context: [
                <FormattedMessage
                  key="lifetime"
                  id="combinedProfile.lifetimeEarned"
                  defaultMessage="{amount} lifetime earned"
                  values={{
                    amount: (
                      <FormattedNumber
                        value={lifetimeEarned}
                        style="currency"
                        currency="USD"
                        maximumFractionDigits={0}
                      />
                    )
                  }}
                />
              ]
            }}
          />
        </Container>

        <Container fixed maxWidth="lg">
          <Root container>
            <SwitcherRow>
              <PillTabs
                activeTab={activeRole}
                onChange={handleRoleChange}
                tabs={[
                  {
                    value: 'overview',
                    label: (
                      <FormattedMessage
                        id="combinedProfile.tab.overview"
                        defaultMessage="Overview"
                      />
                    )
                  },
                  {
                    value: 'contributor',
                    label: (
                      <FormattedMessage
                        id="combinedProfile.tab.contributor"
                        defaultMessage="Contributor"
                      />
                    )
                  },
                  {
                    value: 'maintainer',
                    label: (
                      <FormattedMessage
                        id="combinedProfile.tab.maintainer"
                        defaultMessage="Maintainer"
                      />
                    )
                  },
                  {
                    value: 'provider',
                    label: (
                      <FormattedMessage
                        id="combinedProfile.tab.provider"
                        defaultMessage="Service provider"
                      />
                    )
                  },
                  {
                    value: 'funding',
                    label: (
                      <FormattedMessage id="combinedProfile.tab.funding" defaultMessage="Funding" />
                    )
                  }
                ]}
              >
                <></>
              </PillTabs>
            </SwitcherRow>

            {activeRole === 'overview' && (
              <>
                <StatsRow>
                  <StatusCard
                    completed={statsCompleted}
                    name={
                      <FormattedMessage
                        id="combinedProfile.stat.solved"
                        defaultMessage="Issues solved"
                      />
                    }
                    status={contributorStats.issuesSolvedCount ?? '—'}
                  />
                  <StatusCard
                    completed={statsCompleted}
                    name={
                      <FormattedMessage
                        id="combinedProfile.stat.led"
                        defaultMessage="Projects led"
                      />
                    }
                    status={maintainerStats.projectsMaintainedCount ?? '—'}
                  />
                  <StatusCard
                    completed={statsCompleted}
                    name={
                      <FormattedMessage
                        id="combinedProfile.stat.delivered"
                        defaultMessage="Jobs delivered"
                      />
                    }
                    status={providerStats.jobsDeliveredCount ?? '—'}
                  />
                  <StatusCard
                    completed={statsCompleted}
                    name={
                      <FormattedMessage
                        id="combinedProfile.stat.lifetime"
                        defaultMessage="Lifetime earned"
                      />
                    }
                    status={
                      <FormattedNumber
                        value={lifetimeEarned}
                        style="currency"
                        currency="USD"
                        maximumFractionDigits={0}
                      />
                    }
                  />
                </StatsRow>

                {projects.length > 0 && (
                  <>
                    <Divider textAlign="left">
                      <FormattedMessage
                        id="combinedProfile.overview.projects"
                        defaultMessage="Maintainer · projects"
                      />
                    </Divider>
                    <Grid container spacing={2} sx={{ mt: 0.5, mb: 3 }}>
                      {projects.slice(0, 2).map((project) => (
                        <Grid key={project.id} size={{ xs: 12, sm: 6 }}>
                          <ProjectSummaryCard project={project} />
                        </Grid>
                      ))}
                    </Grid>
                  </>
                )}

                {links.length > 0 && (
                  <>
                    <Divider textAlign="left">
                      <FormattedMessage
                        id="combinedProfile.overview.links"
                        defaultMessage="Provider · top payment links"
                      />
                    </Divider>
                    {links.slice(0, 3).map((link) => (
                      <PaymentLinkItem key={link.id} link={link} />
                    ))}
                  </>
                )}
              </>
            )}

            {activeRole === 'contributor' && (
              <>
                <StatsRow>
                  <StatusCard
                    completed={statsCompleted}
                    name={
                      <FormattedMessage
                        id="combinedProfile.stat.solved"
                        defaultMessage="Issues solved"
                      />
                    }
                    status={contributorStats.issuesSolvedCount ?? '—'}
                  />
                  <StatusCard
                    completed={statsCompleted}
                    name={
                      <FormattedMessage id="combinedProfile.stat.earned" defaultMessage="Earned" />
                    }
                    status={
                      <FormattedNumber
                        value={contributorStats.totalEarned ?? 0}
                        style="currency"
                        currency="USD"
                        maximumFractionDigits={0}
                      />
                    }
                  />
                </StatsRow>
                <SectionTable
                  transparent
                  tableData={issues}
                  tableHeaderMetadata={issueMetadata}
                  customColumnRenderer={columnRenderer}
                  serverSidePagination={serverSidePagination}
                />
              </>
            )}

            {activeRole === 'maintainer' && (
              <>
                <StatsRow>
                  <StatusCard
                    completed={statsCompleted}
                    name={
                      <FormattedMessage
                        id="combinedProfile.stat.projects"
                        defaultMessage="Projects"
                      />
                    }
                    status={maintainerStats.projectsMaintainedCount ?? '—'}
                  />
                  <StatusCard
                    completed={statsCompleted}
                    name={
                      <FormattedMessage id="combinedProfile.stat.funded" defaultMessage="Funded" />
                    }
                    status={
                      <FormattedNumber
                        value={maintainerStats.totalFundedForProjects ?? 0}
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
                        id="combinedProfile.stat.openBounties"
                        defaultMessage="Open bounties"
                      />
                    }
                    status={maintainerStats.openBountiesCount ?? '—'}
                  />
                  <StatusCard
                    completed={statsCompleted}
                    name={
                      <FormattedMessage
                        id="combinedProfile.stat.contributors"
                        defaultMessage="Contributors"
                      />
                    }
                    status={maintainerStats.contributorsCount ?? '—'}
                  />
                </StatsRow>
                <Divider textAlign="left">
                  <FormattedMessage
                    id="combinedProfile.projectsMaintained"
                    defaultMessage="Projects maintained"
                  />
                </Divider>
                <Grid container spacing={2} sx={{ mt: 0.5, mb: 3 }}>
                  {projects.map((project) => (
                    <Grid key={project.id} size={{ xs: 12, sm: 6 }}>
                      <ProjectSummaryCard project={project} />
                    </Grid>
                  ))}
                </Grid>
                <Divider textAlign="left">
                  <FormattedMessage
                    id="combinedProfile.openBounties"
                    defaultMessage="Open bounties · accepting work"
                  />
                </Divider>
                <SectionTable
                  transparent
                  tableData={issues}
                  tableHeaderMetadata={issueMetadata}
                  customColumnRenderer={columnRenderer}
                  serverSidePagination={serverSidePagination}
                />
              </>
            )}

            {activeRole === 'provider' && (
              <>
                <StatsRow>
                  <StatusCard
                    completed={statsCompleted}
                    name={<FormattedMessage id="combinedProfile.stat.jobs" defaultMessage="Jobs" />}
                    status={providerStats.jobsDeliveredCount ?? '—'}
                  />
                  <StatusCard
                    completed={statsCompleted}
                    name={
                      <FormattedMessage
                        id="combinedProfile.stat.received"
                        defaultMessage="Received"
                      />
                    }
                    status={
                      <FormattedNumber
                        value={providerStats.totalReceived ?? 0}
                        style="currency"
                        currency="USD"
                        maximumFractionDigits={0}
                      />
                    }
                  />
                </StatsRow>
                <Divider textAlign="left">
                  <FormattedMessage
                    id="combinedProfile.paymentLinks"
                    defaultMessage="Payment links"
                  />
                </Divider>
                {links.map((link) => (
                  <PaymentLinkItem key={link.id} link={link} />
                ))}
              </>
            )}

            {activeRole === 'funding' && (
              <>
                <StatsRow>
                  <StatusCard
                    completed={statsCompleted}
                    name={
                      <FormattedMessage
                        id="combinedProfile.stat.projectsSponsored"
                        defaultMessage="Projects sponsored"
                      />
                    }
                    status={fundingStats.projectsSponsoredCount ?? '—'}
                  />
                  <StatusCard
                    completed={statsCompleted}
                    name={
                      <FormattedMessage
                        id="combinedProfile.stat.totalFunded"
                        defaultMessage="Total funded"
                      />
                    }
                    status={
                      <FormattedNumber
                        value={fundingStats.totalFunded ?? 0}
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
                        id="combinedProfile.stat.bountiesPlaced"
                        defaultMessage="Bounties placed"
                      />
                    }
                    status={fundingStats.bountiesPlacedCount ?? '—'}
                  />
                </StatsRow>
                <Divider textAlign="left">
                  <FormattedMessage
                    id="combinedProfile.projectsSponsored"
                    defaultMessage="Projects sponsored"
                  />
                </Divider>
                <SponsoredProjectsTable
                  rows={buildSponsoredProjectRows(issues.data, profile?.id)}
                  completed={issues.completed}
                />
              </>
            )}
          </Root>
        </Container>
      </Page>
      <TaskDetailDrawer task={openTask} open={!!openTask} onClose={() => setOpenTask(null)} />
    </React.Fragment>
  )
}

export default CombinedProfilePage
