import React, { useState } from 'react'
import ImportIssueButton from '../../topbar-layouts/topbar-layout/import-issue'
import ImportIssueDialog from '../../topbar-layouts/topbar-layout/import-issue-dialog'
import ProfileAccountMenu from '../../../../molecules/menus/profile-account-menu/profile-account-menu'
import { FormattedMessage } from 'react-intl'
import { Grid } from '@mui/material'
import { useHistory } from 'react-router-dom'
import { Container, Wrapper, Inner, ActionButton, Account } from './account-header-layout.styles'
import useUserTypes from '../../../../../../hooks/use-user-types'

// styles moved to account-header.styles.ts

const AccountHeader = ({ user, onCreateTask, onLogout }) => {
  const history = useHistory()

  const { isContributor, isMaintainer, isFunding, isProvider } = useUserTypes({ user })

  const [openAddIssue, setOpenAddIssue] = useState(false)

  const handleAddIssueClick = () => {
    setOpenAddIssue(true)
  }

  const onHandleCreateTask = (props: any, history: any) => {
    onCreateTask(props, history)
    setOpenAddIssue(false)
  }

  return (
    <Container>
      <Grid size={{ xs: 12, md: 4 }}></Grid>
      <Grid size={{ xs: 12, md: 8 }} component={Wrapper}>
        <Inner>
          {(isContributor || isProvider) && (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {isContributor && (
                <ActionButton
                  onClick={() => history.push('/profile/explore')}
                  color="primary"
                  variant="outlined"
                >
                  <FormattedMessage
                    id="profile.header.action.secondary"
                    defaultMessage="Work on an issue"
                  />
                </ActionButton>
              )}
              <ActionButton
                onClick={() => history.push('/profile/payment-requests')}
                color="primary"
                variant="outlined"
              >
                <FormattedMessage
                  id="profile.header.action.requestPayment"
                  defaultMessage="Request Payment"
                />
              </ActionButton>
            </div>
          )}
          {(isMaintainer || isFunding) && (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <ImportIssueButton onAddIssueClick={handleAddIssueClick} />
              <ImportIssueDialog
                open={openAddIssue}
                onClose={() => setOpenAddIssue(false)}
                onCreate={(props: any) => onHandleCreateTask(props, history)}
                user={user}
              />
            </div>
          )}
        </Inner>
        <Account>
          <ProfileAccountMenu user={user} onLogout={onLogout} />
        </Account>
      </Grid>
    </Container>
  )
}

export default AccountHeader
