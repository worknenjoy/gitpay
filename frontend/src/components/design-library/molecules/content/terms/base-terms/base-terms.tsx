import React from 'react'
import { Typography } from '@mui/material'
import { ArrowBack } from '@mui/icons-material'
import { FormattedMessage } from 'react-intl'
import { TermsContainer, Header, ContentArea, ActionsBar, ActionButton } from './base-terms.styles'

type BaseTermsProps = {
  title: React.ReactNode | string
  subtitle: React.ReactNode | string
  updated: React.ReactNode | string
  content: React.ReactNode | string
  onArrowBack?: () => void
  onAgreeTerms?: () => void
  noHeader?: boolean
  extraStyles?: boolean
}

const BaseTerms = ({
  title,
  subtitle,
  updated,
  content,
  onArrowBack,
  onAgreeTerms,
  noHeader,
  extraStyles = true,
}: BaseTermsProps) => {
  return (
    <>
      <TermsContainer extraStyles={extraStyles}>
        {noHeader ? null : (
          <>
            <Header>
              {onArrowBack && (
                <a onClick={onArrowBack} href="#">
                  <ArrowBack />
                </a>
              )}
              <Typography variant="h4" color="textPrimary" gutterBottom>
                {title}
              </Typography>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                {updated}
              </Typography>
            </Header>
            <Typography variant="subtitle1" gutterBottom>
              {subtitle}
            </Typography>
          </>
        )}
        <ContentArea>
          <Typography variant="body2" gutterBottom>
            {content}
          </Typography>
        </ContentArea>
        {onAgreeTerms && (
          <ActionsBar>
            <ActionButton onClick={onAgreeTerms} variant="contained" color="primary" size="large">
              <FormattedMessage id="terms-base.accept" defaultMessage="I agree" />
            </ActionButton>
          </ActionsBar>
        )}
      </TermsContainer>
    </>
  )
}

export default BaseTerms
