import { connect } from 'react-redux'
import Roles from '../../components/areas/private/features/roles/user-roles'
import { updateUser } from '../../actions/userActions'
import { fetchRoles, createRoles, deleteRoles } from '../../actions/userRoleActions'
import { addNotification, closeNotification } from '../../actions/notificationActions'
import { getUserData } from '../../common/selectors/user/getUser'

const mapStateToProps = (state: any, ownProps?: any) => {
  return {
    roles: state.roles,
    user: getUserData(state)
  }
}

const mapDispatchToProps = (dispatch: any, ownProps?: any) => {
  return {
    addNotification: (message: any, options: any) => dispatch(addNotification(message, options)),
    closeNotification: () => dispatch(closeNotification()),
    fetchRoles: () => dispatch(fetchRoles()),
    updateUser: (userData: any) => dispatch(updateUser(userData)),
    createRoles: (data: any) => dispatch(createRoles(data)),
    deleteRoles: (data: any) => dispatch(deleteRoles(data))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Roles)
