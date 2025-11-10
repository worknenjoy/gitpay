import { connect } from 'react-redux';
import { activateUser } from '../actions/userActions';
import AccountActivation from '../components/areas/public/features/session/pages/account-activation-page';

const mapDispatchToProps = (dispatch) => ({
  activateAccount: (token: string, userId: number) => dispatch(activateUser(userId, token))
});

export default connect(null, mapDispatchToProps)(AccountActivation);