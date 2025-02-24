import { connect } from 'react-redux';
import { activateUser } from '../actions/userActions';
import AccountActivation from '../components/areas/profile/features/account/features/account-activation/account-activation';

const mapDispatchToProps = (dispatch) => ({
  activateAccount: (token: string, userId: number) => dispatch(activateUser(userId, token)),
});

export default connect(null, mapDispatchToProps)(AccountActivation);