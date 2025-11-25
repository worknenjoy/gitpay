import React from 'react'
import MainTitle from '../../../atoms/typography/main-title/main-title'
import { ProfileHeaderContainer } from './profile-main-header.styles'

type ProfileMainHeaderProps = {
  title: string | React.ReactNode // Allow title to be a string or a React node
  subtitle: string | React.ReactNode // Allow subtitle to be a string or a React node
  aside?: React.ReactNode // Optional prop for additional content on the right side
  completed?: boolean // Optional prop to indicate if the status is completed
}

const ProfileMainHeader = ({ title, subtitle, aside }: ProfileMainHeaderProps) => {
  return (
    <ProfileHeaderContainer>
      <MainTitle title={title} subtitle={subtitle} />
      {aside && aside}
    </ProfileHeaderContainer>
  )
}

export default ProfileMainHeader
