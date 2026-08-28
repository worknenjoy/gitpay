import React from 'react'
import { Page, PageContent, PageContentWrapper } from '../../../../../styleguide/components/Page'
import ProfileSideBar from '../../../organisms/layouts/sidebar-layouts/profile-sidebar-layout/profile-sidebar-layout'
import AccountHeader from '../../../organisms/layouts/header-layouts/account-header-layout/account-header-layout'
import Bottom from '../../../organisms/layouts/bottom-bar-layouts/bottom-bar-layout/bottom-bar-layout'
import { useHistory } from 'react-router-dom'
import ProfileHeader from '../../../molecules/headers/profile-main-header/profile-main-header'
import { SecondaryBar, ContainerRoot } from './private-base.styles'

type PrivateBaseProps = {
  children: React.ReactNode
  user: any
  createTask: () => void
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
  signOut,
  profileHeaderProps = undefined,
  bottomProps = { info: { bounties: 0, users: 0, tasks: 0 }, getInfo: () => {} }
}: PrivateBaseProps) => {
  // removed useStyles
  const history = useHistory()

  const handleSignOut = () => {
    history.replace({ pathname: '/' })
    signOut()
  }

  return (
    <Page>
      <SecondaryBar color="primary" position="static" elevation={0} />
      <PageContent>
        <PageContentWrapper>
          <ProfileSideBar user={user} />
          <div style={{ flexGrow: 1 }}>
            <AccountHeader user={user} onCreateTask={createTask} onLogout={handleSignOut} />
            <ContainerRoot maxWidth="lg">
              {profileHeaderProps && (
                <ProfileHeader
                  title={profileHeaderProps.title}
                  subtitle={profileHeaderProps.subtitle}
                />
              )}
              {children}
            </ContainerRoot>
          </div>
        </PageContentWrapper>
      </PageContent>
      <Bottom {...bottomProps} />
    </Page>
  )
}

export default PrivateBase
