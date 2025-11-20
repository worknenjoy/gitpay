import { connect } from 'react-redux'
import Roles from '../components/areas/private/features/roles/user-roles'
import { updateUser } from '../actions/userActions'
import { fetchRoles, createRoles, deleteRoles } from '../actions/userRoleActions'
import { addNotification, closeNotification } from '../actions/notificationActions'
import { getUserData } from '../common/selectors/user/getUser'

const mapStateToProps = (state, ownProps) => {
  return {
    roles: state.roles,
    user: getUserData(state),
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    addNotification: (message) => dispatch(addNotification(message)),
    closeNotification: () => dispatch(closeNotification()),
    fetchRoles: () => dispatch(fetchRoles()),
    updateUser: (id, data) => dispatch(updateUser(id, data)),
    createRoles: (data) => dispatch(createRoles(data)),
    deleteRoles: (data) => dispatch(deleteRoles(data)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Roles)
