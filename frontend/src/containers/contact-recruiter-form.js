import { connect } from 'react-redux'
import { messageRecruiters } from '../actions/contactActions'
import ContactRecruiterForm from '../components/areas/public/features/welcome/legacy/contact-recruiter-form'

const mapStateToProps = (state, props) => {
  return {
    contact: state.contact
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    contactRecruiters: (params) => dispatch(messageRecruiters(params))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ContactRecruiterForm)
