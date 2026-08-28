import { connect } from 'react-redux'
import { acceptTerms } from '../../actions/userActions'
import { fetchLoggedUser } from '../../actions/loginActions'
import { fetchProfileTypes } from '../../actions/userProfileTypeActions'
import { getUserData } from '../../common/selectors/user/getUser'
import AcceptTermsPage from '../../components/design-library/pages/private-pages/accept-terms-page/accept-terms-page'

const mapStateToProps = (state: any) => ({
  completed: state.loggedIn.completed,
  user: getUserData(state),
  profileTypes: state.profileTypes
})

const mapDispatchToProps = (dispatch: any) => ({
  onAccept: (payload: { name?: string; Types?: Array<string | number> }) =>
    dispatch(acceptTerms(payload)),
  fetchLoggedUser: () => dispatch(fetchLoggedUser()),
  fetchProfileTypes: () => dispatch(fetchProfileTypes())
})

export default connect(mapStateToProps, mapDispatchToProps)(AcceptTermsPage)
