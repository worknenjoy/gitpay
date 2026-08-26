import { connect } from 'react-redux'
import { registerUser, forgotPassword } from '../../actions/loginActions'
import { loggedIn, logOut } from '../../actions/loginActions'
import { createTask } from '../../actions/taskActions'
import { fetchProfileTypes } from '../../actions/userProfileTypeActions'
import { info } from '../../actions/infoActions'
import { joinTeam } from '../../actions/teamActions'

const mapStateToProps = (state: any) => {
  return {
    user: state.loggedIn,
    roles: state.profileTypes,
    info: state.info
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    isLogged: () => dispatch(loggedIn()),
    signOut: () => dispatch(logOut()),
    registerUser: (user: any) => dispatch(registerUser(user)),
    forgotPassword: (email: any) => dispatch(forgotPassword(email)),
    createTask: (task: any, history: any) => dispatch(createTask(task, history)),
    fetchRoles: () => dispatch(fetchProfileTypes()),
    getInfo: () => dispatch(info()),
    joinTeam: (email: string) => dispatch(joinTeam(email))
  }
}

const CommonContainer = (Component: any) => {
  return connect(mapStateToProps, mapDispatchToProps)(Component)
}

export default CommonContainer
