import { useEffect } from 'react'
import Auth from '../../../../../../modules/auth'
import { useHistory, useParams } from 'react-router-dom'

const AcceptTermsSession = () => {
  const history = useHistory()
  const { token } = useParams<{ token: string }>()

  useEffect(() => {
    Auth.authenticateUser(token)
    history.replace('/accept-terms')
  }, [token, history])

  return null
}

export default AcceptTermsSession
