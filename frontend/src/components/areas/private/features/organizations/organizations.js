import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { styled } from '@mui/material/styles'
import Chip from '@mui/material/Chip'
import Avatar from '@mui/material/Avatar'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Button from '@mui/material/Button'
import {
  WorkRounded as WorkRoundedIcon,
  Done as DoneIcon,
  Sync as ImportIcon
} from '@mui/icons-material'
import { Typography } from '@mui/material'

const Root = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  padding: theme.spacing(0.5)
}))

class Organizations extends Component {
  constructor(props) {
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
    this.props
      .onImport({
        name: this.state.currentOrg.name,
        userId: this.props.user.id
      })
      .then((org) => {
        this.setState({ dialogOpen: false })
      })
      .catch((e) => {
        // eslint-disable-next-line no-console
        console.log('error', e)
        this.setState({ dialogOpen: false })
      })
  }

  render() {
    const { data } = this.props
    const { dialogOpen, currentOrg } = this.state

    return (
      <Root>
        {data.length &&
          data.map((org) => {
            return (
              <Chip
                avatar={<Avatar src={org.image} />}
                key={org.name}
                clickable
                icon={<WorkRoundedIcon />}
                label={org.name}
                onDelete={() => this.handleClick(org)}
                onClick={() => this.handleClick(org)}
                sx={{ m: 0.5 }}
                deleteIcon={org.imported ? <DoneIcon /> : <ImportIcon />}
              />
            )
          })}
        <Dialog open={dialogOpen} onClose={this.handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">
            <FormattedMessage
              id="organization.dialog.title"
              defaultMessage="Import organizations"
            />
          </DialogTitle>
          <DialogContent>
            {currentOrg && currentOrg.organizations && (
              <DialogContentText>
                <FormattedMessage
                  id="organization.dialog.exist"
                  defaultMessage="We have an project imported already"
                />
                {currentOrg.organizations.map((o) => {
                  return (
                    <div style={{ marginTop: 20, marginBottom: 20 }}>
                      <Typography>Project: {o.name}</Typography>
                      <Typography>User: {o.User && o.User.name}</Typography>
                    </div>
                  )
                })}
              </DialogContentText>
            )}
            <DialogContentText>
              <FormattedMessage
                id="organization.dialog.desc"
                defaultMessage="You can import organizations in order to manage on Gitpay"
              />
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Organization name"
              value={currentOrg.name}
              disabled
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              <FormattedMessage id="organization.dialog.cancel" defaultMessage="Cancel" />
            </Button>
            {currentOrg && currentOrg.organizations && currentOrg.organizations.length ? (
              <Button onClick={this.handleImport} disabled color="primary">
                <FormattedMessage
                  id="organization.dialog.action.transfer"
                  defaultMessage="Cant transfer now"
                />
              </Button>
            ) : (
              <Button onClick={this.handleImport} disabled={currentOrg.imported} color="primary">
                <FormattedMessage id="organization.dialog.action.import" defaultMessage="Import" />
              </Button>
            )}
          </DialogActions>
        </Dialog>
      </Root>
    )
  }
}

export default Organizations
