import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { withStyles } from '@material-ui/core/styles'
import Chip from '@material-ui/core/Chip'
import Avatar from '@material-ui/core/Avatar'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Button from '@material-ui/core/Button'
import { 
  WorkRounded as WorkRoundedIcon,
  Done as DoneIcon,
  Sync as ImportIcon 
} from '@material-ui/icons'
import { Typography } from '@material-ui/core'

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    padding: theme.spacing(0.5),
  },
  chip: {
    margin: theme.spacing(0.5),
  },
})

class Organizations extends Component {
  constructor (props) {
    super(props)
    this.state = {
      dialogOpen: false,
      currentOrg: {}
    }
  }

  static propTypes = {
    classes: PropTypes.object.isRequired,
    data: PropTypes.object,
    user: PropTypes.object,
    onImport: PropTypes.func
  }

  handleClick = (org) => {
    this.setState({ dialogOpen: true, currentOrg: org })
  }

  handleClose = () => {
    this.setState({ dialogOpen: false })
  }

  handleImport = () => {
    this.props.onImport({
      name: this.state.currentOrg.name,
      userId: this.props.user.id
    }).then(org => {
      this.setState({ dialogOpen: false })
    }).catch(e => {
      // eslint-disable-next-line no-console
      console.log('error', e)
      this.setState({ dialogOpen: false })
    })
  }

  render () {
    const { classes, data } = this.props
    const { dialogOpen, currentOrg } = this.state

    return (
      <div className={ classes.root }>
        { data.length && data.map(org => {
          return (
            <Chip
              avatar={ <Avatar src={ org.image } /> }
              key={ org.name }
              clickable
              icon={ <WorkRoundedIcon /> }
              label={ org.name }
              onDelete={ () => this.handleClick(org) }
              onClick={ () => this.handleClick(org) }
              className={ classes.chip }
              deleteIcon={ org.imported ? <DoneIcon /> : <ImportIcon /> }
            />
          )
        }) }
        <Dialog open={ dialogOpen } onClose={ this.handleClose } aria-labelledby='form-dialog-title'>
          <DialogTitle id='form-dialog-title'>
            <FormattedMessage id='organization.dialog.title' defaultMessage='Import organizations' />
          </DialogTitle>
          <DialogContent>
            { currentOrg && currentOrg.organizations &&
              <DialogContentText>
                <FormattedMessage id='organization.dialog.exist' defaultMessage='We have an project imported already' />
                  { currentOrg.organizations.map(o => {
                    return (
                      <div style={{marginTop: 20, marginBottom: 20}}>
                        <Typography>Project: {o.name}</Typography>
                        <Typography>User: {o.User && o.User.name}</Typography>
                      </div>
                    )
                  }  )}
              </DialogContentText>
            }
            <DialogContentText>
              <FormattedMessage id='organization.dialog.desc' defaultMessage='You can import organizations in order to manage on Gitpay' />
            </DialogContentText>
            <TextField
              autoFocus
              margin='dense'
              id='name'
              label='Organization name'
              value={ currentOrg.name }
              disabled
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={ this.handleClose } color='primary'>
              <FormattedMessage id='organization.dialog.cancel' defaultMessage='Cancel' />
            </Button>
            { currentOrg && currentOrg.organizations && currentOrg.organizations.length ? (
              <Button onClick={ this.handleImport } disabled={ true } color='primary'>
                <FormattedMessage id='organization.dialog.action.transfer' defaultMessage='Cant transfer now' />
              </Button>
            ) : (
              <Button onClick={ this.handleImport } disabled={ currentOrg.imported } color='primary'>
                <FormattedMessage id='organization.dialog.action.import' defaultMessage='Import' />
              </Button>
            ) }
            
          </DialogActions>
        </Dialog>
      </div>
    )
  }
}

export default withStyles(styles)(Organizations)
