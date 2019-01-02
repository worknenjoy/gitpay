import axios from 'axios'
import Auth from '../../modules/auth'

export const validToken = () => {
  if (Auth.getToken()) {
    axios.defaults.headers.common['authorization'] = Auth.getToken()
  }

  return true
}
