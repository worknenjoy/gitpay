import React, { useState } from 'react'
import TextEllipsis from 'text-ellipsis'
import { useHistory } from 'react-router-dom'
import { useIntl } from 'react-intl'
import { Tooltip, Typography, IconButton } from '@mui/material'
import FileCopyIcon from '@mui/icons-material/FileCopy'

const LinkField = ({
  url,
  icon,
  iconImg = false,
  title,
  tooltipTitle,
  external = false,
  copiable = false,
  limit = 42,
  width = 350
}) => {
  const history = useHistory()
  const intl = useIntl()
  const [copied, setCopied] = useState(false)

  const handleClickListItem = (e) => {
    if (external) {
      e.preventDefault()
      history.push(url)
    } else {
      window.open(url, '_blank')
    }
  }

  const handleCopy = async (e) => {
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch (err) {
      // handle error if needed
    }
  }

  return (
    <div style={{ width: width, display: 'flex', alignItems: 'center' }}>
      <a style={{ cursor: 'pointer' }} onClick={handleClickListItem}>
        <Typography variant="subtitle2">{TextEllipsis(`${title || 'no title'}`, limit)}</Typography>
      </a>

      <a target="_blank" href={url} rel="noreferrer">
        <Tooltip id="tooltip-fab" title={tooltipTitle} placement="top">
          <>
            {iconImg && (
              <img
                width="18"
                src={icon}
                style={{
                  borderRadius: '50%',
                  padding: 3,
                  backgroundColor: 'black',
                  borderColor: 'black',
                  borderWidth: 1,
                  marginLeft: 10
                }}
              />
            )}
            {icon && !iconImg && icon}
          </>
        </Tooltip>
      </a>
      {copiable && (
        <Tooltip title={intl.formatMessage({ id: 'copyLink', defaultMessage: 'Copy link' })}>
          <IconButton size="small" onClick={handleCopy} style={{ marginLeft: 8 }}>
            <FileCopyIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
    </div>
  )
}

export default LinkField
