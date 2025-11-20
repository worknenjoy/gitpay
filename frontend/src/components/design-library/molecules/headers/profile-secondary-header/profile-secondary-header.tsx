import React from 'react'
import SecondaryTitle from '../../../atoms/typography/secondary-title/secondary-title'
import { Container } from './profile-secondary-header.styles'

type ProfileSecondaryHeaderProps = {
  title: string | React.ReactNode // Allow title to be a string or a React node
  subtitle: string | React.ReactNode // Allow subtitle to be a string or a React node
  aside?: React.ReactNode // Optional prop for additional content on the right side
}

const ProfileSecondaryHeader = ({ title, subtitle, aside }: ProfileSecondaryHeaderProps) => {
  return (
    <Container>
      <SecondaryTitle title={title} subtitle={subtitle} />
      {aside && aside}
    </Container>
  )
}

export default ProfileSecondaryHeader
