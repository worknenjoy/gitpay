import React from 'react'
import { Tooltip } from '@mui/material'
import { HelpOutline as HelpIcon } from '@mui/icons-material'
import { useIntl } from 'react-intl'
import { Trigger } from './help-tooltip.styles'

export type HelpTooltipProps = {
  /** What the help is about, used for the accessible name ("About …"). */
  label: React.ReactNode
  text: React.ReactNode
  defaultOpen?: boolean
}

const HelpTooltip = ({ label, text, defaultOpen }: HelpTooltipProps) => {
  const intl = useIntl()
  const [open, setOpen] = React.useState(Boolean(defaultOpen))
  const ariaLabel = intl.formatMessage(
    { id: 'helpTooltip.about', defaultMessage: 'About {label}' },
    { label: typeof label === 'string' ? label : '' }
  )

  return (
    <Tooltip
      title={text}
      arrow
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
    >
      <Trigger tabIndex={0} role="button" aria-label={ariaLabel}>
        <HelpIcon />
      </Trigger>
    </Tooltip>
  )
}

export default HelpTooltip
