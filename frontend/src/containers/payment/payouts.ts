import { connect } from 'react-redux'
import { fetchAccountBalance, fetchAccount } from '../../actions/userActions'
import { searchPayout, requestPayout } from '../../actions/payoutActions'
import Payouts from '../../components/areas/private/features/payouts/payouts'
import { getCurrentUser } from '../../common/selectors/user/getUser'

const mapStateToProps = (state: any) => {
  return {
    user: getCurrentUser(state),
    account: state.account,
    payouts: state.payouts,
    balance: state.balance
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    searchPayout: (params: any) => dispatch(searchPayout(params)),
    requestPayout: (params: any) => dispatch(requestPayout(params)),
    fetchAccountBalance: () => dispatch(fetchAccountBalance()),
    fetchAccount: () => dispatch(fetchAccount())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Payouts)
