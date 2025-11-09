import { useEffect } from 'react'
import Auth from '../../../../../../modules/auth'
import { useHistory, useParams } from 'react-router-dom'

const Session = () => {
  const history = useHistory()
  const { token } = useParams<{ token: string }>()

  useEffect(() => {
    const referer = Auth.getReferer()

    Auth.authenticateUser(token)

    if (referer && referer !== '/') {
      history.replace(referer)
    } else {
      history.replace('/profile')
    }
  }, [token, history])

  return null
}

export default Session
