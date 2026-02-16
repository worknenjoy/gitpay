/* eslint-disable no-console */
import { connect } from 'react-redux'
import ExploreOrganizationPage from '../../components/areas/public/features/explore/pages/explore-organization-page'
import { listOrganizations } from '../../actions/organizationsActions'

const mapStateToProps = (state: any, props?: any) => {
  return {
    organizations: state.organizations
  }
}

const mapDispatchToProps = (dispatch: any, ownProps?: any) => {
  return {
    listOrganizations: () => dispatch(listOrganizations())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ExploreOrganizationPage)
