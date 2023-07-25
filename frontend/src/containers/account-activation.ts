import { connect } from 'react-redux';
import { activateUser } from '../actions/userActions';
import AccountActivation from '../components/profile/account-activation';

const mapDispatchToProps = (dispatch: any) => ({
  activateAccount: (token: string, userId: number) => dispatch(activateUser(userId, token)),
});

export default connect(null, mapDispatchToProps)(AccountActivation);