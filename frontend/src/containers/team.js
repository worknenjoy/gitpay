import { connect } from 'react-redux'
import Team from '../components/team/team'
import { joinTeam } from '../actions/teamActions'

const mapStateToProps = (state, ownProps) => {
  return state
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    joinTeamAPICall: (email) => dispatch(joinTeam(email))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Team)
