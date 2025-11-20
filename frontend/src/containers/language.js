import { connect } from 'react-redux'
import { listLanguage } from '../actions/languageActions'
import Language from '../components/design-library/atoms/filters/languages-filter/languages-filter'
import { listTasks } from '../actions/taskActions'

const mapStateToProps = (state, ownProps) => {
  return {
    languages: state.languages,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    listLanguages: (params) => dispatch(listLanguage(params)),
    listTasks: (params) => dispatch(listTasks(params)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Language)
