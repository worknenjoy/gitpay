import { connect } from 'react-redux'
import ProfileHead from '../components/profile/profile-head'
import { getUser } from '../common/selectors/user/getUser'

const mapStateToProps = state => {
  return {
    user: getUser(state),
  }
}

export default connect(mapStateToProps, null)(ProfileHead)
