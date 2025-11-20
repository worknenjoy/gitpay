import { connect } from 'react-redux'
import ProfileHead from '../components/areas/private/components/profile-head'
import { getUserTypes } from '../actions/profileActions'

const mapStateToProps = (state) => {
  return {
    profile: state.profileReducer.data
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getUserTypes: (userId) => dispatch(getUserTypes(userId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileHead)
