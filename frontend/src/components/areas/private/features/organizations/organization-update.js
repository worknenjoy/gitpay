import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import Chip from '@mui/material/Chip'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Button,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
} from '@mui/material'

import { Sync as SyncIcon } from '@mui/icons-material'

// styles removed; using inline/sx where needed

class OrganizationUpdate extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dialogOpen: false,
      provider: null,
    }
  }

  static propTypes = {
    organization: PropTypes.object,
    updateOrganization: PropTypes.func,
  }

  handleClose = () => {
    this.setState({ dialogOpen: false })
  }

  handleUpdate = (e, id) => {
    this.props
      .updateOrganization({
        id,
        provider: this.state.provider,
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

  onChangeProvider = (e) => {
    this.setState({ provider: e.target.value })
  }

  render() {
    const { organization } = this.props
    const { dialogOpen } = this.state

    return (
      <React.Fragment>
        <Chip
          style={{ marginLeft: 10 }}
          size="small"
          deleteIcon={<SyncIcon />}
          label="Couldnt obtain provider. Update now to sync"
          color="secondary"
          onDelete={() => this.setState({ dialogOpen: true })}
        />
        <Dialog open={dialogOpen} onClose={this.handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">
            <FormattedMessage
              id="organization.update.dialog.title"
              defaultMessage="Update Organization provider"
            />
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              <FormattedMessage
                id="organization.update.dialog.desc"
                defaultMessage="We could find your provider. Please provide to us."
              />
            </DialogContentText>
            <FormControl fullWidth>
              <RadioGroup
                name={'reason'}
                value={this.state.provider}
                onChange={this.onChangeProvider}
              >
                <FormControlLabel
                  id="organization.provider.github"
                  value={'github'}
                  label={'Github'}
                  control={<Radio color="primary" />}
                />
                <FormControlLabel
                  id="organization.provider.bitbucket"
                  value={'bitbucket'}
                  label={'Bitbucket'}
                  control={<Radio color="primary" />}
                />
              </RadioGroup>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              <FormattedMessage id="organization.dialog.cancel" defaultMessage="Cancel" />
            </Button>
            <Button
              onClick={(e) => this.handleUpdate(e, organization.id)}
              disabled={!this.state.provider}
              color="primary"
            >
              <FormattedMessage id="organization.dialog.action.update" defaultMessage="Update" />
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    )
  }
}

export default OrganizationUpdate
