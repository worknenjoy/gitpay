import React from 'react'
import { FormattedMessage, FormattedNumber } from 'react-intl'
import { Chip } from '@mui/material'
import GitHubIcon from '@mui/icons-material/GitHub'
import IssueLanguageField from 'design-library/molecules/tables/section-table/section-table-custom-fields/issue/issue-language-field/issue-language-field'
import {
  Root,
  Head,
  TitleRow,
  OrgLink,
  Slash,
  Description,
  Row,
  Muted,
  Action
} from './project-summary-card.styles'

export type ProjectSummary = {
  id: number | string
  name: string
  org?: string
  orgUrl?: string
  description?: string
  openBountyCount?: number
  totalPaid?: number
  issuesCount?: number
  projectUrl?: string
  ProgrammingLanguages?: Array<{ name: string }>
}

type ProjectSummaryCardProps = {
  project: ProjectSummary
}

const ProjectSummaryCard = ({ project }: ProjectSummaryCardProps) => (
  <Root elevation={0} variant="outlined">
    <Head>
      <div style={{ minWidth: 0 }}>
        <TitleRow>
          <GitHubIcon fontSize="small" />
          {project.org && (
            <>
              <OrgLink href={project.orgUrl} target="_blank" rel="noreferrer">
                {project.org}
              </OrgLink>
              <Slash>/</Slash>
            </>
          )}
          <span>{project.name}</span>
        </TitleRow>
        {project.description && <Description variant="body2">{project.description}</Description>}
      </div>
      {project.openBountyCount != null && (
        <Chip
          size="small"
          label={
            <FormattedMessage
              id="projectSummaryCard.openBounties"
              defaultMessage="{count} open"
              values={{ count: project.openBountyCount }}
            />
          }
        />
      )}
    </Head>

    {project.ProgrammingLanguages?.length ? (
      <IssueLanguageField issue={{ Project: project }} />
    ) : null}

    <Row>
      <span>
        {project.totalPaid != null && (
          <>
            <Muted>
              <FormattedMessage id="projectSummaryCard.paidOut" defaultMessage="Paid out" />{' '}
            </Muted>
            <b>
              <FormattedNumber
                value={project.totalPaid}
                style="currency"
                currency="USD"
                maximumFractionDigits={0}
              />
            </b>
          </>
        )}
        {project.issuesCount != null && (
          <>
            {'  '}
            <Muted>
              <FormattedMessage id="projectSummaryCard.issues" defaultMessage="Issues" />{' '}
            </Muted>
            <b>{project.issuesCount}</b>
          </>
        )}
      </span>
      {project.projectUrl && (
        <Action href={project.projectUrl}>
          <FormattedMessage id="projectSummaryCard.viewProject" defaultMessage="View project →" />
        </Action>
      )}
    </Row>
  </Root>
)

export default ProjectSummaryCard
