import { connect } from 'react-redux'
import Wallets from '../components/profile/wallets'
import { fetchCustomer } from '../actions/userActions'
import { getUser } from '../common/selectors/user/getUser'

const mapStateToProps = (state, ownProps) => {
  return {
    user: getUser(state),
    customer: state.customer,
    logged: state.loggedIn.logged
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    fetchCustomer: (id) => dispatch(fetchCustomer(id)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Wallets)
