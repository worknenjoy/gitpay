import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import { Tooltip, IconButton } from '@mui/material'
import FileCopyIcon from '@mui/icons-material/FileCopy'

export type CopyIconButtonProps = {
  /** The text copied to the clipboard */
  value: string
  tooltipTitle?: React.ReactNode
  size?: 'small' | 'medium'
}

const COPIED_FEEDBACK_MS = 1500

const CopyIconButton = ({ value, tooltipTitle, size = 'small' }: CopyIconButtonProps) => {
  const intl = useIntl()
  const [copied, setCopied] = useState(false)

  const defaultTooltip = intl.formatMessage({
    id: 'copyIconButton.copy',
    defaultMessage: 'Copy'
  })
  const copiedTooltip = intl.formatMessage({
    id: 'copyIconButton.copied',
    defaultMessage: 'Copied!'
  })

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), COPIED_FEEDBACK_MS)
    } catch (err) {
      // clipboard access denied or unavailable — nothing to recover here
    }
  }

  return (
    <Tooltip title={copied ? copiedTooltip : (tooltipTitle ?? defaultTooltip)}>
      <IconButton size={size} onClick={handleCopy}>
        <FileCopyIcon fontSize={size} />
      </IconButton>
    </Tooltip>
  )
}

export default CopyIconButton
