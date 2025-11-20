import React from 'react'
import { Typography } from '@mui/material'
import { ArrowBack } from '@mui/icons-material'
import { FormattedMessage } from 'react-intl'
import { Button, Paper } from '@mui/material'

type TermsOfServiceProps = {
  onArrowBack?: () => void
  onAgreeTerms?: () => void
  extraStyles?: boolean
}

const TermsOfService = ({ onArrowBack, onAgreeTerms, extraStyles }: TermsOfServiceProps) => {
  const content = `
  {br}
  Welcome to our bounty platform! Our platform provides a marketplace for contributors, maintainers, and sponsors to connect and collaborate on open source and private projects. By using our platform, you agree to the following terms and conditions:
  {br}
  {br}
  1. Account Creation: To use our platform, you must create an account. You agree to provide accurate and complete information when creating your account. You are responsible for maintaining the security of your account and any actions taken on your account.
{br}
{br}
2. Projects: Our platform allows maintainers to post projects and bounties for contributors to work on. You agree to use our platform only for lawful purposes and to follow any rules and guidelines set forth by the maintainers.
{br}
{br}
3. Bounties: Our platform allows sponsors to offer bounties for the completion of tasks related to a project. You agree to offer bounties only for lawful tasks and to follow any rules and guidelines set forth by the maintainers.
{br}
{br}
4. Payments: Our platform processes payments for completed bounties. You agree to pay the agreed-upon bounty amount within the designated timeframe.
{br}
{br}
5. Disputes: In the event of a dispute between contributors, maintainers, and sponsors, our platform will act as a mediator to resolve the dispute. You agree to abide by the decision made by our platform in such disputes.
{br}
{br}
6. Intellectual Property: You retain ownership of any intellectual property you create while using our platform. You agree to grant maintainers and sponsors a non-exclusive license to use any intellectual property you create while working on a project.
{br}
{br}
7. Termination: We reserve the right to terminate your account at any time if we believe you have violated these terms and conditions.
{br}
{br}
8. Limitation of Liability: Our platform is provided on an "as is" basis without warranties of any kind, either express or implied. We are not liable for any damages arising out of your use or inability to use our platform.
{br}{br}
9. Governing Law: These terms and conditions shall be governed by and construed in accordance with the laws of the jurisdiction in which our platform is based.
{br}{br}
10. Changes: We reserve the right to modify these terms and conditions at any time. We will notify you of any changes via email or through our platform.
{br}{br}
By using our platform, you agree to these terms and conditions. If you do not agree, you may not use our platform.
{br}{br}`

  return (
    <>
      <div
        style={
          extraStyles
            ? {
                padding: 20,
                textAlign: 'left',
                position: 'absolute',
                top: 0,
                left: 0,
                background: 'white',
                width: '100%'
              }
            : {}
        }
      >
        <div style={{ marginBottom: 10 }}>
          {onArrowBack && (
            <a onClick={onArrowBack} href="#">
              <ArrowBack />
            </a>
          )}
          <Typography variant="h4" gutterBottom>
            <FormattedMessage id="terms-of-service.title" defaultMessage="Terms of service" />
          </Typography>
          <Typography variant="caption" gutterBottom>
            <FormattedMessage id="terms-of-service.date" defaultMessage="Updated 5 May, 2023" />
          </Typography>
        </div>
        <Typography variant="body1" gutterBottom>
          <FormattedMessage id="terms-of-service.subtitle" defaultMessage="About the terms" />
        </Typography>
        <div style={{ overflow: 'scroll', height: 'calc(100vh - 200px)' }}>
          <Typography variant="body1" gutterBottom>
            <FormattedMessage
              id="terms-of-service.content"
              defaultMessage={content}
              values={{ br: <br /> }}
            />
          </Typography>
        </div>
        {onAgreeTerms && (
          <Paper
            style={{
              position: 'absolute',
              bottom: 20,
              left: 0,
              height: 80,
              width: '100%',
              background: 'white'
            }}
          >
            <Button
              onClick={onAgreeTerms}
              variant="contained"
              color="primary"
              size="large"
              style={{ float: 'right', marginRight: 20, marginTop: 20 }}
            >
              <FormattedMessage id="terms-of-service.accept" defaultMessage="I agree" />
            </Button>
          </Paper>
        )}
      </div>
    </>
  )
}

export default TermsOfService
