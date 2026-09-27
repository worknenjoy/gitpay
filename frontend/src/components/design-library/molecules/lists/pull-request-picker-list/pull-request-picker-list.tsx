import React from 'react'
import { TextField, MenuItem } from '@mui/material'
import { FormattedMessage, useIntl } from 'react-intl'
import CountedTabList from '../../tabs/counted-tab-list/counted-tab-list'
import EmptyBase from '../../content/empty/empty-base/empty-base'
import PullRequestIcon from '../../../atoms/icons/pull-request-icon/pull-request-icon'
import PullRequestPickerListPlaceholder from './pull-request-picker-list.placeholder'
import {
  Root,
  ScopeRow,
  List,
  Row,
  RadioDot,
  RowMeta,
  RowTitle
} from './pull-request-picker-list.styles'

export type PullRequestPickerRow = {
  repo: string
  number: number
  title: string
  when: string
  state: 'open' | 'closed'
}

export type PullRequestPickerOwner = {
  id: string
  kind: string
}

export type PullRequestPickerListProps = {
  pullRequests: PullRequestPickerRow[]
  owners: PullRequestPickerOwner[]
  value?: number
  onChange: (pullRequestNumber: number) => void
  filter: 'open' | 'closed'
  onFilterChange: (filter: 'open' | 'closed') => void
  owner: string
  onOwnerChange: (owner: string) => void
  repo: string
  onRepoChange: (repo: string) => void
  loading?: boolean
}

const PullRequestPickerList = ({
  pullRequests,
  owners,
  value,
  onChange,
  filter,
  onFilterChange,
  owner,
  onOwnerChange,
  repo,
  onRepoChange,
  loading = false
}: PullRequestPickerListProps) => {
  const intl = useIntl()
  const scoped = pullRequests.filter(
    (pr) =>
      (owner === 'all' || pr.repo.split('/')[0] === owner) && (repo === 'all' || pr.repo === repo)
  )
  const repos = Array.from(
    new Set(
      pullRequests
        .filter((pr) => owner === 'all' || pr.repo.split('/')[0] === owner)
        .map((pr) => pr.repo)
    )
  )
  const rows = scoped.filter((pr) => pr.state === filter)
  const countFor = (state: 'open' | 'closed') => scoped.filter((pr) => pr.state === state).length

  return (
    <Root>
      <CountedTabList
        value={filter}
        onChange={(nextValue) => onFilterChange(nextValue as 'open' | 'closed')}
        items={[
          {
            value: 'open',
            label: (
              <FormattedMessage id="design.pullRequestPickerList.open" defaultMessage="Open" />
            ),
            count: countFor('open')
          },
          {
            value: 'closed',
            label: (
              <FormattedMessage id="design.pullRequestPickerList.closed" defaultMessage="Closed" />
            ),
            count: countFor('closed')
          }
        ]}
      />
      <ScopeRow>
        <TextField
          select
          size="small"
          label={intl.formatMessage({
            id: 'design.pullRequestPickerList.owner',
            defaultMessage: 'User or organization'
          })}
          value={owner}
          onChange={(e) => {
            onOwnerChange(e.target.value)
            onRepoChange('all')
          }}
        >
          <MenuItem value="all">
            <FormattedMessage
              id="design.pullRequestPickerList.allAccounts"
              defaultMessage="All accounts"
            />
          </MenuItem>
          {owners.map((o) => (
            <MenuItem key={o.id} value={o.id}>
              {o.id} · {o.kind}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          size="small"
          label={intl.formatMessage({
            id: 'design.pullRequestPickerList.repo',
            defaultMessage: 'Project'
          })}
          value={repo}
          onChange={(e) => onRepoChange(e.target.value)}
        >
          <MenuItem value="all">
            <FormattedMessage
              id="design.pullRequestPickerList.allProjects"
              defaultMessage="All projects"
            />
          </MenuItem>
          {repos.map((r) => (
            <MenuItem key={r} value={r}>
              {r}
            </MenuItem>
          ))}
        </TextField>
      </ScopeRow>
      {loading ? (
        <List role="radiogroup">
          <PullRequestPickerListPlaceholder />
        </List>
      ) : rows.length === 0 ? (
        <EmptyBase
          icon={<PullRequestIcon />}
          iconSize={32}
          text={
            <FormattedMessage
              id="design.pullRequestPickerList.empty"
              defaultMessage="No {filter} pull requests here."
              values={{ filter }}
            />
          }
        />
      ) : (
        <List role="radiogroup">
          {rows.map((pr) => {
            const selected = value === pr.number
            return (
              <Row
                key={pr.number}
                type="button"
                role="radio"
                aria-checked={selected}
                data-selected={selected}
                onClick={() => onChange(pr.number)}
              >
                <RadioDot />
                <div>
                  <RowMeta>
                    {pr.repo} · #{pr.number} · {pr.when}
                  </RowMeta>
                  <RowTitle>{pr.title}</RowTitle>
                </div>
              </Row>
            )
          })}
        </List>
      )}
    </Root>
  )
}

export default PullRequestPickerList
