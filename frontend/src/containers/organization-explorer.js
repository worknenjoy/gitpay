/* eslint-disable no-console */
import { connect } from 'react-redux'
import ExploreOrganizationPage from '../components/areas/public/features/explore/pages/explore-organization-page'
import { listOrganizations } from '../actions/organizationsActions'

const mapStateToProps = (state, props) => {
  return {
    organizations: state.organizations,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    listOrganizations: () => dispatch(listOrganizations()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ExploreOrganizationPage)
