import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Menu, MenuItem, ListSubheader, InputAdornment } from '@mui/material'
import { Link as LinkIcon, ExpandMore as ChevronIcon } from '@mui/icons-material'
import logoGithub from 'images/github-logo-black.png'
import SolutionInput from 'design-library/atoms/inputs/solution-input/solution-input'
import StatusChip from 'design-library/atoms/status/status-chip/status-chip'
import { PrIcon } from 'design-library/molecules/menus/linked-pull-requests-menu/linked-pull-requests-menu.styles'
import PullRequestIcon from 'design-library/atoms/icons/pull-request-icon/pull-request-icon'
import {
  Field,
  Label,
  InputBox,
  Input,
  PickerButton,
  Hint,
  RowText,
  RowTitle,
  RowMeta
} from './solution-pr-field.styles'

export type MyPullRequest = {
  repo: string
  number: number
  title: string
  when: string
  state: 'merged' | 'open' | 'closed'
  /** e.g. "Mentions #3094" — highlighted as a good match. */
  note?: string
}

type SolutionPrFieldProps = {
  value: string
  onChange: (url: string) => void
  /**
   * The contributor's own pull requests. Omit (default) when not available —
   * the field is then the plain URL input.
   */
  myPullRequests?: MyPullRequest[]
  /** GitHub login when connected; omit when not connected. */
  connectedAs?: string
  /** Shows "Connect GitHub" when not connected. */
  onConnect?: () => void
  defaultMenuOpen?: boolean
}

export const pullRequestUrl = (pr: MyPullRequest) =>
  `https://github.com/${pr.repo}/pull/${pr.number}`

const GROUPS: { state: MyPullRequest['state']; label: React.ReactNode }[] = [
  { state: 'merged', label: <FormattedMessage id="solutionPr.group.merged" defaultMessage="Merged" /> },
  { state: 'open', label: <FormattedMessage id="solutionPr.group.open" defaultMessage="Open" /> }
]

/** Pull request URL for a solution, with an optional picker of the contributor's own PRs. */
const SolutionPrField = ({
  value,
  onChange,
  myPullRequests,
  connectedAs,
  onConnect,
  defaultMenuOpen = false
}: SolutionPrFieldProps) => {
  const intl = useIntl()
  const boxRef = React.useRef<HTMLDivElement>(null)
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null)

  React.useEffect(() => {
    if (defaultMenuOpen && boxRef.current) setAnchorEl(boxRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const hasPicker = Boolean(myPullRequests) || Boolean(onConnect)

  if (!hasPicker) {
    return (
      <SolutionInput
        pullRequestURL={value}
        handlePullRequestURLChange={(e) => onChange(e.target.value)}
      />
    )
  }

  const connected = Boolean(connectedAs)

  return (
    <Field>
      <Label>
        <FormattedMessage id="solutionPr.label" defaultMessage="Pull request URL" />
      </Label>
      <InputBox ref={boxRef}>
        <Input
          fullWidth
          disableUnderline
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://github.com/owner/repo/pull/123"
          inputProps={{ 'data-testid': 'pull-request-url' }}
          startAdornment={
            <InputAdornment position="start">
              <LinkIcon fontSize="small" />
            </InputAdornment>
          }
          endAdornment={
            <InputAdornment position="end">
              {connected ? (
                <PickerButton
                  type="button"
                  aria-haspopup="menu"
                  aria-expanded={Boolean(anchorEl)}
                  onClick={() => setAnchorEl(boxRef.current)}
                >
                  <img src={logoGithub} alt="" />
                  <FormattedMessage id="solutionPr.myPullRequests" defaultMessage="My pull requests" />
                  <ChevronIcon fontSize="small" />
                </PickerButton>
              ) : (
                onConnect && (
                  <PickerButton type="button" onClick={onConnect}>
                    <img src={logoGithub} alt="" />
                    <FormattedMessage id="solutionPr.connect" defaultMessage="Connect GitHub" />
                  </PickerButton>
                )
              )}
            </InputAdornment>
          }
        />
      </InputBox>
      <Hint>
        {connected ? (
          <FormattedMessage
            id="solutionPr.hint.connected"
            defaultMessage="Connected as {login}. Paste a URL or pick from your pull requests."
            values={{ login: <b>{connectedAs}</b> }}
          />
        ) : (
          <FormattedMessage
            id="solutionPr.hint.notConnected"
            defaultMessage="Paste the URL, or connect GitHub to pick from your pull requests."
          />
        )}
      </Hint>
      {connected && myPullRequests && (
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          slotProps={{
            paper: { sx: { width: anchorEl?.clientWidth, maxHeight: 340 } }
          }}
          aria-label={intl.formatMessage({
            id: 'solutionPr.myPullRequests',
            defaultMessage: 'My pull requests'
          })}
        >
          {GROUPS.flatMap(({ state, label }) => {
            const rows = myPullRequests.filter((pr) => pr.state === state)
            if (rows.length === 0) return []
            return [
              <ListSubheader key={`group-${state}`} sx={{ fontSize: 11.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, lineHeight: '32px' }}>
                {label}
              </ListSubheader>,
              ...rows.map((pr) => (
                <MenuItem
                  key={`${pr.repo}-${pr.number}`}
                  selected={value === pullRequestUrl(pr)}
                  onClick={() => {
                    onChange(pullRequestUrl(pr))
                    setAnchorEl(null)
                  }}
                  sx={{ gap: 1.25 }}
                >
                  <PrIcon data-state={pr.state}>
                    <PullRequestIcon sx={{ fontSize: 14 }} />
                  </PrIcon>
                  <RowText>
                    <RowTitle>{pr.title}</RowTitle>
                    <RowMeta>
                      {pr.repo} #{pr.number} · {pr.when}
                    </RowMeta>
                  </RowText>
                  {pr.note && <StatusChip tone="success" label={pr.note} />}
                </MenuItem>
              ))
            ]
          })}
        </Menu>
      )}
    </Field>
  )
}

export default SolutionPrField
