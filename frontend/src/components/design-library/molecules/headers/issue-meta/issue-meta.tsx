import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Link } from '@mui/material'
import { ChatBubbleOutline as MessageIcon } from '@mui/icons-material'
import logoGithub from 'images/github-logo-black.png'
import logoBitbucket from 'images/bitbucket-logo-blue.png'
import AvatarStack from 'design-library/atoms/data-display/avatar-stack/avatar-stack'
import AuthorTag from 'design-library/atoms/badges/author-tag/author-tag'
import LinkedPullRequestsMenu, {
  LinkedPullRequest
} from 'design-library/molecules/menus/linked-pull-requests-menu/linked-pull-requests-menu'
import { Root, Row, Group, StatusDot, Sep, ProviderLogo, MessageButton } from './issue-meta.styles'

export type IssueMetaPerson = {
  name: string
  avatarUrl?: string
  url?: string
}

type IssueMetaProps = {
  provider?: 'github' | 'bitbucket' | string
  /** Link to the issue on the provider. */
  providerUrl?: string
  status?: 'open' | 'closed' | string
  /** Author on the provider. */
  author?: IssueMetaPerson
  /** Who imported the issue to Gitpay. */
  importer?: IssueMetaPerson
  /** `undefined` when unknown → neither tag is shown. */
  importerIsAuthor?: boolean
  linkedPullRequests?: LinkedPullRequest[]
  /** Shows the Message button. */
  onMessage?: () => void
  linkedOpen?: boolean
}

const PersonLink = ({ person }: { person: IssueMetaPerson }) => (
  <Group>
    <AvatarStack people={[person]} size="sm" withTooltip={false} />
    {person.url ? (
      <Link href={person.url} target="_blank" rel="noopener noreferrer" color="inherit">
        {person.name}
      </Link>
    ) : (
      <span>{person.name}</span>
    )}
  </Group>
)

/** The lines under the issue title: where it lives, who wrote it, who imported it. */
const IssueMeta = ({
  provider,
  providerUrl,
  status,
  author,
  importer,
  importerIsAuthor,
  linkedPullRequests = [],
  onMessage,
  linkedOpen
}: IssueMetaProps) => {
  const providerName = provider === 'bitbucket' ? 'Bitbucket' : 'GitHub'
  const shownAuthor = importerIsAuthor && importer ? importer : author
  const isClosed = status === 'closed'

  return (
    <Root>
      {provider && (
        <Row>
          <Group>
            <StatusDot data-closed={isClosed} />
            {isClosed ? (
              <FormattedMessage id="issue.meta.closedOn" defaultMessage="Closed on" />
            ) : (
              <FormattedMessage id="issue.meta.openOn" defaultMessage="Open on" />
            )}{' '}
            <Link href={providerUrl} target="_blank" rel="noopener noreferrer" color="inherit">
              {providerName}
            </Link>
            <ProviderLogo
              src={provider === 'bitbucket' ? logoBitbucket : logoGithub}
              alt=""
            />
            {shownAuthor && (
              <>
                <FormattedMessage id="issue.meta.by" defaultMessage="by" />
                <PersonLink person={shownAuthor} />
                {importerIsAuthor && <AuthorTag variant="verified" />}
              </>
            )}
          </Group>
          {linkedPullRequests.length > 0 && (
            <>
              <Sep />
              <LinkedPullRequestsMenu pullRequests={linkedPullRequests} defaultOpen={linkedOpen} />
            </>
          )}
        </Row>
      )}
      {(importer || onMessage) && (
        <Row>
          {importer && (
            <Group>
              <FormattedMessage id="issue.meta.importedBy" defaultMessage="Imported by" />
              <PersonLink person={importer} />
              {importerIsAuthor === false && <AuthorTag variant="notAuthor" />}
            </Group>
          )}
          {onMessage && (
            <MessageButton type="button" onClick={onMessage}>
              <MessageIcon />
              <FormattedMessage id="issue.meta.message" defaultMessage="Message" />
            </MessageButton>
          )}
        </Row>
      )}
    </Root>
  )
}

export default IssueMeta
