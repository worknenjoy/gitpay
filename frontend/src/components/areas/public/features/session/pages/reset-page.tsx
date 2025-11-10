import React, { useEffect } from "react"
import ResetPasswordPage from "design-library/pages/public-pages/session-public-pages/reset-password-page/reset-password-page"
import { useParams } from "react-router-dom";

const ResetPage = ({ user, searchUser, resetPassword }) => {
  const { token } = useParams<{ token: string }>()

  useEffect(() => {
    if (token) {
      searchUser({ recover_password_token: token })
    }
  }, [token, searchUser])

  return (
    <ResetPasswordPage
      user={user}
      resetPassword={resetPassword}
    />
  );
}

export default ResetPage;