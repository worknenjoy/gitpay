import { useEffect } from 'react'
import { useHistory } from 'react-router-dom'

const useCommonActions = ({
  isLogged,
  user,
  registerUser,
  forgotPassword,
  createTask,
  info,
  getInfo,
  signOut,
  roles,
  fetchRoles
}) => {
  const history = useHistory()

  const handleSignupUser = async (data) => {
    await registerUser(data)
  }

  const handleForgotPassword = async (data) => {
    await forgotPassword(data)
  }

  const handleImportIssue = async (data) => {
    await createTask(data, history)
  }

  useEffect(() => {
    isLogged?.()
  }, [])

  return {
    user: user,
    bottomBarProps: {
      info,
      getInfo
    },
    accountMenuProps: {
      signOut
    },
    loginFormSignupFormProps: {
      onSubmit: handleSignupUser,
      roles,
      fetchRoles
    },
    loginFormForgotFormProps: {
      onSubmit: handleForgotPassword
    },
    importIssuesProps: {
      onImport: handleImportIssue
    }
  }
}

export default useCommonActions
