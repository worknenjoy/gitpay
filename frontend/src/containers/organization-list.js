/* eslint-disable no-console */
import { connect } from 'react-redux'
import OrganizationList from '../components/organization/organization-list'
import { listOrganizations } from '../actions/organizationsActions'

const mapStateToProps = (state, props) => {
  return {
    organizations: state.organizations.organizations
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    listOrganizations: () => dispatch(listOrganizations())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrganizationList)
