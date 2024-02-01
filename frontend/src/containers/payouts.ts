import { connect } from 'react-redux';
import { searchPayout } from '../actions/payoutActions';
import Payouts from '../components/profile/payouts';

const mapStateToProps = (state: any) => {
  return {
    user: state.loggedIn,
    payouts: state.payouts
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    searchPayout: (params: any) => dispatch(searchPayout(params))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Payouts);