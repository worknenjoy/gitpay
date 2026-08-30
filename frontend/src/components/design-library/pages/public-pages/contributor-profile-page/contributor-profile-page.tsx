import React from 'react'
import { Container, Divider, Chip } from '@mui/material'
import { FormattedMessage } from 'react-intl'
import ProfileUserHeader from 'design-library/molecules/headers/profile-user-header/profile-user-header'
import PillTabs from 'design-library/molecules/tabs/pill-tabs/pill-tabs'
import PaymentLinkItem from 'design-library/molecules/lists/payment-link-item/payment-link-item'
import TaskDetailDrawer from 'design-library/molecules/drawers/task-detail-drawer/task-detail-drawer'
import SectionTable from 'design-library/molecules/tables/section-table/section-table'
import {
  useIssueMetadata,
  useIssueColumnRenderer
} from 'design-library/molecules/tables/issue-table/issue-table'
import { Page } from '../../../../../styleguide/components/Page'
import { Root, SwitcherRow, SkillsRow, SubTabsRow } from './contributor-profile-page.styles'

const parseCsv = (value?: unknown): string[] => {
  if (typeof value !== 'string') return []
  const trimmed = value.trim()
  if (!trimmed) return []
  return trimmed
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean)
}

type ContributorProfilePageProps = {
  profile: any
  stats?: {
    issuesSolvedCount?: number
    issuesSponsoredCount?: number
    totalEarned?: number
    joinedAt?: string
  }
  paymentLinks: any[]
  issues: { data: any[]; completed: boolean; totalCount?: number }
  serverSidePagination?: any
  onTabChange: (tab: 'solved' | 'sponsored') => void
}

const ContributorProfilePage = ({
  profile,
  stats = {},
  paymentLinks,
  issues,
  serverSidePagination,
  onTabChange
}: ContributorProfilePageProps) => {
  const [section, setSection] = React.useState<'services' | 'bounties'>('services')
  const [bountiesTab, setBountiesTab] = React.useState<'solved' | 'sponsored'>('solved')
  const [openTask, setOpenTask] = React.useState<any>(null)

  const issueMetadata = useIssueMetadata({ includeProject: true, includeActions: true })
  const columnRenderer = useIssueColumnRenderer({ onViewDetails: setOpenTask })

  const handleSectionChange = (_e: any, value: 'services' | 'bounties') => {
    setSection(value)
    if (value === 'bounties') onTabChange(bountiesTab)
  }

  const handleBountiesTabChange = (_e: any, value: 'solved' | 'sponsored') => {
    setBountiesTab(value)
    onTabChange(value)
  }

  const skills = parseCsv(profile?.skills)

  return (
    <React.Fragment>
      <Page>
        <Container fixed maxWidth="lg">
          <ProfileUserHeader
            profile={profile}
            roles={[{ name: 'contributor', tone: 'orange', active: true }]}
            cta={[
              {
                label: (
                  <FormattedMessage id="contributorProfile.hireMe" defaultMessage="Hire me →" />
                )
              },
              {
                label: (
                  <FormattedMessage id="contributorProfile.sponsor" defaultMessage="Sponsor" />
                ),
                variant: 'outlined'
              }
            ]}
            meta={{
              identity: [
                stats.joinedAt && (
                  <FormattedMessage
                    key="joined"
                    id="contributorProfile.joined"
                    defaultMessage="Joined {date}"
                    values={{
                      date: new Intl.DateTimeFormat('en', {
                        month: 'short',
                        year: 'numeric'
                      }).format(new Date(stats.joinedAt))
                    }}
                  />
                ),
                stats.issuesSolvedCount != null && (
                  <FormattedMessage
                    key="solved"
                    id="contributorProfile.issuesSolved"
                    defaultMessage="{count} issues solved"
                    values={{ count: stats.issuesSolvedCount }}
                  />
                )
              ].filter(Boolean),
              availability: profile?.openForJobs
                ? [
                    {
                      label: (
                        <FormattedMessage
                          id="contributorProfile.openForJobs"
                          defaultMessage="Open for job opportunities"
                        />
                      ),
                      dot: true
                    }
                  ]
                : []
            }}
          />
        </Container>

        <Container fixed maxWidth="lg">
          <Root container>
            <SwitcherRow>
              <PillTabs
                activeTab={section}
                onChange={handleSectionChange}
                tabs={[
                  {
                    value: 'services',
                    label: (
                      <FormattedMessage
                        id="contributorProfile.services"
                        defaultMessage="Services"
                      />
                    )
                  },
                  {
                    value: 'bounties',
                    label: (
                      <FormattedMessage
                        id="contributorProfile.bounties"
                        defaultMessage="Bounties"
                      />
                    )
                  }
                ]}
              >
                <></>
              </PillTabs>
            </SwitcherRow>

            {section === 'services' && (
              <>
                <Divider textAlign="left">
                  <FormattedMessage
                    id="contributorProfile.paymentLinks"
                    defaultMessage="Payment links"
                  />
                </Divider>
                {paymentLinks.length === 0 ? (
                  <FormattedMessage
                    id="contributorProfile.noPaymentLinks"
                    defaultMessage="No payment links yet."
                  />
                ) : (
                  paymentLinks.map((link) => <PaymentLinkItem key={link.id} link={link} />)
                )}
              </>
            )}

            {section === 'bounties' && (
              <>
                {skills.length > 0 && (
                  <>
                    <Divider textAlign="left">
                      <FormattedMessage id="contributorProfile.skills" defaultMessage="Skills" />
                    </Divider>
                    <SkillsRow>
                      {skills.map((skill) => (
                        <Chip key={skill} size="small" label={skill} />
                      ))}
                    </SkillsRow>
                  </>
                )}

                <Divider textAlign="left">
                  <FormattedMessage
                    id="contributorProfile.bountiesHeading"
                    defaultMessage="Bounties"
                  />
                </Divider>
                <SubTabsRow>
                  <PillTabs
                    activeTab={bountiesTab}
                    onChange={handleBountiesTabChange}
                    tabs={[
                      {
                        value: 'solved',
                        label: (
                          <FormattedMessage
                            id="contributorProfile.issuesSolvedTab"
                            defaultMessage="Issues solved{count}"
                            values={{
                              count:
                                stats.issuesSolvedCount != null
                                  ? ` (${stats.issuesSolvedCount})`
                                  : ''
                            }}
                          />
                        )
                      },
                      {
                        value: 'sponsored',
                        label: (
                          <FormattedMessage
                            id="contributorProfile.sponsoredTab"
                            defaultMessage="Sponsored{count}"
                            values={{
                              count:
                                stats.issuesSponsoredCount != null
                                  ? ` (${stats.issuesSponsoredCount})`
                                  : ''
                            }}
                          />
                        )
                      }
                    ]}
                  >
                    <></>
                  </PillTabs>
                </SubTabsRow>
                <SectionTable
                  transparent
                  tableData={issues}
                  tableHeaderMetadata={issueMetadata}
                  customColumnRenderer={columnRenderer}
                  serverSidePagination={serverSidePagination}
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

export default ContributorProfilePage
