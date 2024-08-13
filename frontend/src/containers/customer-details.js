import { connect } from 'react-redux'
import CustomerDetails from '../components/profile/account-customer'
import {
 fetchCustomer,
 createCustomer,
 updateCustomer,
} from '../actions/userActions'
import { searchUser } from '../actions/loginActions' 

const mapStateToProps = (state, ownProps) => {
  return {
    logged: state.loggedIn.logged,
    user: state.loggedIn,
    customer: state.customer
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    fetchCustomer: data => {
      dispatch(fetchCustomer(data))
    },
    createCustomer: data => {
      dispatch(createCustomer(data))
    },
    updateCustomer: data => {
      dispatch(updateCustomer(_, data))
    },
    searchUser: data => {
      dispatch(searchUser(data))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomerDetails)
