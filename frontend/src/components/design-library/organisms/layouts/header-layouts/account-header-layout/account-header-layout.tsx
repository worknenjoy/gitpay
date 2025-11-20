import React, { useState } from 'react'
import ImportIssueButton from '../../topbar-layouts/topbar-layout/import-issue'
import ImportIssueDialog from '../../topbar-layouts/topbar-layout/import-issue-dialog'
import ProfileAccountMenu from '../../../../molecules/menus/profile-account-menu/profile-account-menu'
import { FormattedMessage } from 'react-intl'
import { Grid } from '@mui/material'
import { useHistory } from 'react-router-dom'
import { Container, Wrapper, Inner, ActionButton, Account } from './account-header-layout.styles'

// styles moved to account-header.styles.ts

const AccountHeader = ({ user, onCreateTask, onLogout }) => {
  const history = useHistory()

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
          {user?.Types?.map((t: any) => t.name).includes('contributor') && (
            <Grid container direction="column" alignItems="center">
              <Grid size={{ xs: 12 }}>
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
              </Grid>
            </Grid>
          )}
          {(user?.Types?.map((t: any) => t.name).includes('maintainer') ||
            user?.Types?.map((t: any) => t.name).includes('funding')) && (
            <>
              <ImportIssueButton onAddIssueClick={handleAddIssueClick} />
              <ImportIssueDialog
                open={openAddIssue}
                onClose={() => setOpenAddIssue(false)}
                onCreate={(props: any) => onHandleCreateTask(props, history)}
                user={user}
              />
            </>
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
