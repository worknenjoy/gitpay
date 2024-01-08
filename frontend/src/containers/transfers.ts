import { connect } from 'react-redux';
import { searchTransfer } from '../actions/transferActions';
import { Transfers } from '../components/profile/transfers';

const mapStateToProps = (state: any) => {
  return {
    user: state.user
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    searchTransfer: (transfer: any) => dispatch(searchTransfer(transfer))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Transfers);