import { connect } from 'react-redux'
import InvoiceSettingsPage from '../../../components/areas/private/features/invoice-settings/pages/invoice-settings-page'
import { fetchCustomer, createCustomer, updateCustomer } from '../../../actions/userActions'

const mapStateToProps = (state, ownProps) => {
  return {
    logged: state.loggedIn.logged,
    user: state.loggedIn,
    customer: state.customer
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    fetchCustomer: () => {
      dispatch(fetchCustomer())
    },
    createCustomer: (data) => {
      dispatch(createCustomer(data))
    },
    updateCustomer: (data) => {
      dispatch(updateCustomer(data))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(InvoiceSettingsPage)
