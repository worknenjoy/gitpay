import { connect } from 'react-redux'
import ProfileTypes from '../../components/areas/private/features/profile-types/user-profile-types'
import { updateUser } from '../../actions/userActions'
import {
  fetchProfileTypes,
  createProfileTypes,
  deleteProfileTypes
} from '../../actions/userProfileTypeActions'
import { addNotification, closeNotification } from '../../actions/notificationActions'
import { getUserData } from '../../common/selectors/user/getUser'

const mapStateToProps = (state: any, ownProps?: any) => {
  return {
    profileTypes: state.profileTypes,
    user: getUserData(state)
  }
}

const mapDispatchToProps = (dispatch: any, ownProps?: any) => {
  return {
    addNotification: (message: any, options: any) => dispatch(addNotification(message, options)),
    closeNotification: () => dispatch(closeNotification()),
    fetchProfileTypes: () => dispatch(fetchProfileTypes()),
    updateUser: (userData: any) => dispatch(updateUser(userData)),
    createProfileTypes: (data: any) => dispatch(createProfileTypes(data)),
    deleteProfileTypes: (data: any) => dispatch(deleteProfileTypes(data))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileTypes)
