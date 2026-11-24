import React from 'react'
import { useIntl } from 'react-intl'
import {
  VisibilityOutlined as PublicIcon,
  VisibilityOffOutlined as UnlistedIcon,
  ExpandMore as ChevronIcon
} from '@mui/icons-material'
import ActionsMenu from 'design-library/molecules/menus/actions-menu/actions-menu'
import { Trigger, ReadOnly } from './issue-visibility-menu.styles'

export type IssueVisibility = 'public' | 'unlisted'

type IssueVisibilityMenuProps = {
  value: IssueVisibility
  /** Without it (non-owners) the visibility shows read-only. */
  onChange?: (value: IssueVisibility) => void
  defaultOpen?: boolean
}

const IssueVisibilityMenu = ({ value, onChange, defaultOpen }: IssueVisibilityMenuProps) => {
  const intl = useIntl()
  const options: { id: IssueVisibility; label: string; description: string }[] = [
    {
      id: 'public',
      label: intl.formatMessage({ id: 'issue.visibility.public', defaultMessage: 'Public' }),
      description: intl.formatMessage({
        id: 'issue.visibility.public.description',
        defaultMessage: 'Listed in Explore and search. Anyone can find it.'
      })
    },
    {
      id: 'unlisted',
      label: intl.formatMessage({ id: 'issue.visibility.unlisted', defaultMessage: 'Not listed' }),
      description: intl.formatMessage({
        id: 'issue.visibility.unlisted.description',
        defaultMessage: 'Hidden from Explore and search. Anyone with the link can open it.'
      })
    }
  ]
  const icon = (id: IssueVisibility) =>
    id === 'public' ? <PublicIcon fontSize="small" /> : <UnlistedIcon fontSize="small" />
  const current = options.find((option) => option.id === value) || options[0]

  if (!onChange) {
    return (
      <ReadOnly>
        {icon(current.id)}
        {current.label}
      </ReadOnly>
    )
  }

  return (
    <ActionsMenu
      align="left"
      menuWidth={300}
      defaultOpen={defaultOpen}
      renderTrigger={(props) => (
        <Trigger
          type="button"
          onClick={props.onClick}
          aria-haspopup={props['aria-haspopup']}
          aria-expanded={props['aria-expanded']}
          title={intl.formatMessage({
            id: 'issue.visibility.change',
            defaultMessage: 'Change visibility'
          })}
        >
          {icon(current.id)}
          {current.label}
          <ChevronIcon fontSize="small" />
        </Trigger>
      )}
      actions={options.map((option) => ({
        children: option.label,
        description: option.description,
        icon: icon(option.id),
        selected: option.id === value,
        onClick: () => option.id !== value && onChange(option.id)
      }))}
    />
  )
}

export default IssueVisibilityMenu
