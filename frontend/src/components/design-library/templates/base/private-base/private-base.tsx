import React, { useEffect } from 'react'
import { Grid } from '@mui/material'
import { Page, PageContent } from '../../../../../styleguide/components/Page'
import ProfileSideBar from '../../../organisms/layouts/sidebar-layouts/profile-sidebar-layout/profile-sidebar-layout'
import AccountHeader from '../../../organisms/layouts/header-layouts/account-header-layout/account-header-layout'
import Bottom from '../../../organisms/layouts/bottom-bar-layouts/bottom-bar-layout/bottom-bar-layout'
import { useHistory } from 'react-router-dom'
import ProfileHeader from '../../../molecules/headers/profile-main-header/profile-main-header'
import ActivateAccountDialog from '../../../molecules/dialogs/activate-account-dialog/activate-account-dialog'
import { RootGrid, SecondaryBar, ContainerRoot } from './private-base.styles'

// styles migrated to private-base.styles.ts

type PrivateBaseProps = {
  children: React.ReactNode
  user: any
  createTask: () => void
  onResendActivationEmail?: () => void
  signOut: () => void
  profileHeaderProps?: {
    title: string
    subtitle: string
  }
  bottomProps?: {
    info: {
      bounties: number
      users: number
      tasks: number
    }
    getInfo: () => void
  }
}

const PrivateBase = ({
  children,
  user,
  createTask,
  onResendActivationEmail,
  signOut,
  profileHeaderProps = undefined,
  bottomProps = { info: { bounties: 0, users: 0, tasks: 0 }, getInfo: () => {} }
}: PrivateBaseProps) => {
  // removed useStyles
  const history = useHistory()
  const { data = {}, completed } = user
  const { email_verified } = data
  const [emailNotVerified, setEmailNotVerified] = React.useState(false)

  const handleSignOut = () => {
    history.replace({ pathname: '/' })
    signOut()
  }

  useEffect(() => {
    if (email_verified === false) {
      setEmailNotVerified(true)
    }
  }, [email_verified])

  return (
    <Page>
      {emailNotVerified && (
        <ActivateAccountDialog
          open={emailNotVerified}
          completed={completed}
          onResend={onResendActivationEmail}
        />
      )}
      <SecondaryBar color="primary" position="static" elevation={0} />
      <PageContent>
        <RootGrid container spacing={0}>
          <ProfileSideBar user={user} />
          <Grid size={{ xs: 12, md: 10 }}>
            <AccountHeader user={data} onCreateTask={createTask} onLogout={handleSignOut} />

            <ContainerRoot maxWidth="lg">
              {profileHeaderProps && (
                <ProfileHeader
                  title={profileHeaderProps.title}
                  subtitle={profileHeaderProps.subtitle}
                />
              )}
              {children}
            </ContainerRoot>
          </Grid>
        </RootGrid>
      </PageContent>
      <Bottom {...bottomProps} />
    </Page>
  )
}

export default PrivateBase
