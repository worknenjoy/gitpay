import { connect } from 'react-redux';
import { fetchAccountBalance } from '../actions/userActions';
import { searchPayout } from '../actions/payoutActions';
import Payouts from '../components/areas/private/features/payouts/payouts';
import { getUserData } from '../common/selectors/user/getUser'

const mapStateToProps = (state: any) => {
  return {
    user: getUserData(state),
    payouts: state.payouts,
    balance: state.balance,
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    searchPayout: (params: any) => dispatch(searchPayout(params)),
    fetchAccountBalance: () => dispatch(fetchAccountBalance())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Payouts);