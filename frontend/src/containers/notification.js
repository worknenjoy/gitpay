import { connect } from 'react-redux'
import { closeNotification } from '../actions/notificationActions'
import Notification from '../components/design-library/atoms/notifications/notification/notification'

const mapStateToProps = (state, ownProps) => {
  return {
    message: state.notification.text,
    link: state.notification.link,
    open: state.notification.open,
    severity: state.notification.severity
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onClose: () => {
      dispatch(closeNotification())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Notification)
