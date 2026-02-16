/* eslint-disable no-console */
import { connect } from 'react-redux'
import ExploreProjectsPage from '../../components/areas/public/features/explore/pages/explore-projects-page'
import { listProjects } from '../../actions/projectActions'

const mapStateToProps = (state: any) => ({
  projects: state.projects
})

const mapDispatchToProps = (dispatch: any, ownProps?: any) => {
  return {
    listProjects: () => dispatch(listProjects())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ExploreProjectsPage)
