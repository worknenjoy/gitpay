import { connect } from 'react-redux'
import { fetchDashboardInfo } from '../../actions/dashboardActions'
import Dashboard from '../../components/areas/private/features/dashboard/dashboard'
import { getCurrentUser } from '../../common/selectors/user/getUser'

const mapStateToProps = (state: any) => {
  return {
    user: getCurrentUser(state),
    dashboard: state.dashboard
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    fetchDashboardInfo: () => dispatch(fetchDashboardInfo())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
