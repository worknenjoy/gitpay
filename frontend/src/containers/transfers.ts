import { connect } from 'react-redux';
import { searchTransfer, updateTransfer } from '../actions/transferActions';
import Transfers from '../components/profile/transfers';

const mapStateToProps = (state: any) => {
  return {
    user: state.loggedIn.user,
    transfers: state.transfers
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    searchTransfer: (params: any) => dispatch(searchTransfer(params)),
    updateTransfer: (params: any) => dispatch(updateTransfer(params))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Transfers);