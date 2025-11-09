import React from 'react'
import SignupPageTemplate from 'design-library/pages/public-pages/session-public-pages/signup-page/signup-page'

const SignupPage = ({
  fetchRoles,
  registerUser,
  roles,
}) => {
  return (
    <SignupPageTemplate
      fetchRoles={fetchRoles}
      handleSignup={registerUser}
      roles={roles}
    />
  )
}

export default SignupPage