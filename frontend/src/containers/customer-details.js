import { connect } from 'react-redux'
import CustomerDetails from '../components/areas/private/features/account/features/account-customer/account-customer'
import { fetchCustomer, createCustomer, updateCustomer } from '../actions/userActions'

const mapStateToProps = (state, ownProps) => {
  return {
    logged: state.loggedIn.logged,
    user: state.loggedIn,
    customer: state.customer
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    fetchCustomer: (data) => {
      dispatch(fetchCustomer(data))
    },
    createCustomer: (data) => {
      dispatch(createCustomer(data))
    },
    updateCustomer: (data) => {
      //eslint-disable-next-line
      dispatch(updateCustomer(_, data))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomerDetails)
