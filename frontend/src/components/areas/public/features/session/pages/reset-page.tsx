import React from "react"
import ResetPasswordPage from "design-library/pages/public-pages/session-public-pages/reset-password-page/reset-password-page"

const ResetPage = ({ user, resetPassword }) => {
  return (
    <ResetPasswordPage
      user={user}
      resetPassword={resetPassword}
    />
  );
}

export default ResetPage;