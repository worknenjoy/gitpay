import React from 'react'
import TextEllipsis from 'text-ellipsis'
import { useHistory } from 'react-router-dom'
import { useIntl } from 'react-intl'
import { Tooltip, Typography } from '@mui/material'
import CopyIconButton from 'design-library/atoms/buttons/copy-icon-button/copy-icon-button'

type LinkFieldProps = {
  url: string
  icon?: React.ReactNode
  iconImg?: boolean
  title?: string
  tooltipTitle?: string
  external?: boolean
  copiable?: boolean
  limit?: number
  width?: number | string
}

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
}: LinkFieldProps) => {
  const history = useHistory()
  const intl = useIntl()

  const handleClickListItem = (e) => {
    if (external) {
      e.preventDefault()
      history.push(url)
    } else {
      window.open(url, '_blank')
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
                src={icon as string}
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
        <span style={{ marginLeft: 8 }}>
          <CopyIconButton
            value={url}
            tooltipTitle={intl.formatMessage({ id: 'copyLink', defaultMessage: 'Copy link' })}
          />
        </span>
      )}
    </div>
  )
}

export default LinkField
