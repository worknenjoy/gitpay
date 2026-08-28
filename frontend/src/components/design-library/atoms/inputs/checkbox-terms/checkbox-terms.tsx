import React, { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { Link, Typography } from '@mui/material'
import { StyledCheckbox, StyledFormControlLabel } from './checkbox-terms.styles'
import TermsDialog from './terms-dialog'

interface CheckboxTermsProps {
  onAccept: (checked: boolean) => void
  labelId?: string
  labelDefaultMessage?: string
  anchorId?: string
  anchorDefaultMessage?: string
  titleId?: string
  titleDefaultMessage?: string
  textId?: string
  textDefaultMessage?: string
  agreeId?: string
  agreeDefaultMessage?: string
  disagreeId?: string
  disagreeDefaultMessage?: string
  content?: React.ReactNode
  align?: 'left' | 'right'
}

const CheckboxTerms = ({
  onAccept,
  labelId = 'task.bounties.interested.termsOfUseLabel',
  labelDefaultMessage = 'I AGREE WITH THE {termsOfUseAnchor} AND THE CONFIDENTIALITY OF INFORMATION',
  anchorId = 'task.bounties.interested.termsOfUse',
  anchorDefaultMessage = 'TERMS OF USE',
  titleId,
  titleDefaultMessage,
  textId,
  textDefaultMessage,
  agreeId,
  agreeDefaultMessage,
  disagreeId,
  disagreeDefaultMessage,
  content,
  align = 'left'
}: CheckboxTermsProps) => {
  const [checked, setChecked] = useState(false)
  const [openTerms, setOpenTerms] = useState(false)

  const handleChange = () => {
    setChecked(!checked)
  }

  useEffect(() => {
    onAccept?.(checked)
  }, [checked])

  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: align === 'right' ? 'flex-end' : 'flex-start'
      }}
    >
      <StyledFormControlLabel
        control={<StyledCheckbox checked={checked} onChange={handleChange} color="primary" />}
        onClick={handleChange}
        labelPlacement={align === 'right' ? 'start' : 'end'}
        label={
          <Typography variant="caption">
            <FormattedMessage
              id={labelId}
              defaultMessage={labelDefaultMessage}
              values={{
                termsOfUseAnchor: (
                  <Link onClick={() => setOpenTerms(true)}>
                    <FormattedMessage id={anchorId} defaultMessage={anchorDefaultMessage} />
                  </Link>
                )
              }}
            />
          </Typography>
        }
      />
      <TermsDialog
        open={openTerms}
        onClose={() => setOpenTerms(false)}
        onAccept={() => setChecked(true)}
        onDisagree={() => setChecked(false)}
        titleId={titleId}
        titleDefaultMessage={titleDefaultMessage}
        textId={textId}
        textDefaultMessage={textDefaultMessage}
        agreeId={agreeId}
        agreeDefaultMessage={agreeDefaultMessage}
        disagreeId={disagreeId}
        disagreeDefaultMessage={disagreeDefaultMessage}
        content={content}
      />
    </div>
  )
}

export default CheckboxTerms
