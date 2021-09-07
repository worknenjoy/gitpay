import { connect } from 'react-redux'
import ProfileHead from '../components/profile/profile-head'
import { getUserTypes } from '../actions/userActions'

const mapStateToProps = state => {
  return {
    profile: state.profileReducer.data
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getUserTypes: (userId) => dispatch(getUserTypes(userId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileHead)
