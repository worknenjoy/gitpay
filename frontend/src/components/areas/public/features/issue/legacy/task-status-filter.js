import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { messages } from '../../../../../../messages/messages'
import { injectIntl, FormattedMessage } from 'react-intl'

import { Chip } from '@mui/material'
import { styled } from '@mui/material/styles'

// removed withStyles; using sx inline

const statuses = ['open', 'in_progress', 'closed']
const additionalStatuses = ['issuesWithBounties', 'contribution']

class TaskStatusFilter extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selected: 'all',
      additionalSelected: null
    }
  }

  static propTypes = {
    classes: PropTypes.object.isRequired,
    onFilter: PropTypes.func
  }

  componentDidMount() {
    const currentFilter = this.props.match.params.filter
    this.handleFromUrl(currentFilter)
  }

  handleFromUrl = (value) => {
    switch (value) {
      case 'open':
        this.props.onFilter('status', 'open')
        this.setState({ selected: 'open' })
        break
      case 'progress':
        this.props.onFilter('status', 'in_progress')
        this.setState({ selected: 'in_progress' })
        break
      case 'finished':
        this.props.onFilter('status', 'closed')
        this.setState({ selected: 'closed' })
        break
      case 'with-bounties':
        this.props.onFilter('status', 'issuesWithBounties')
        this.setState({ additionalSelected: 'issuesWithBounties' })
        break
      case 'contribution':
        this.props.onFilter('status', 'contribution')
        this.setState({ additionalSelected: 'contribution' })
        break
      default:
        this.props.onFilter('all')
    }
  }

  handleListItemClick = (value) => {
    const currentOrganization = this.props.match.params.organization_id
    const currentProject = this.props.match.params.project_id
    const baseUrl =
      currentOrganization && currentProject
        ? '/organizations/' + currentOrganization + '/projects/' + currentProject + '/'
        : '/tasks/'
    switch (value) {
      case 'open':
        this.props.history.push(baseUrl + 'open')
        this.props.onFilter('status', value, this.state.additionalSelected)
        break
      case 'in_progress':
        this.props.history.push(baseUrl + 'progress')
        this.props.onFilter('status', value, this.state.additionalSelected)
        break
      case 'closed':
        this.props.history.push(baseUrl + 'finished')
        this.props.onFilter('status', value, this.state.additionalSelected)
        break
      default:
        this.props.onFilter('all')
    }
    this.setState({ selected: value })
  }

  handleListAdditionalStatusesClick = (value) => {
    const currentOrganization = this.props.match.params.organization_id
    const currentProject = this.props.match.params.project_id
    const baseUrl =
      currentOrganization && currentProject
        ? '/organizations/' + currentOrganization + '/projects/' + currentProject + '/'
        : '/tasks/'
    switch (value) {
      case 'issuesWithBounties':
        this.props.history.push(baseUrl + 'with-bounties')
        this.props.onFilter('status', this.state.selected, value) // passing value as third parameter to consider as additional
        break
      case 'contribution':
        this.props.history.push(baseUrl + 'contribution')
        this.props.onFilter('status', this.state.selected, value) // passing value as third parameter to consider as additional
        break
      default:
        this.props.onFilter('all')
    }
    this.setState({ additionalSelected: value })
  }

  handleClickAll = () => {
    const currentOrganization = this.props.match.params.organization_id
    const currentProject = this.props.match.params.project_id
    const baseUrl =
      currentOrganization && currentProject
        ? '/organizations/' + currentOrganization + '/projects/' + currentProject + '/'
        : '/tasks/'
    this.props.history.push(baseUrl + 'all')
    this.props.onFilter()
    this.setState({ selected: 'all', additionalSelected: null })
  }

  statusesDisplay = (status) => {
    const possibles = {
      open: this.props.intl.formatMessage(messages.openStatus),
      in_progress: this.props.intl.formatMessage(messages.inProgressStatus),
      closed: this.props.intl.formatMessage(messages.closed)
    }
    return possibles[status]
  }

  additionalStatusDisplay = (status) => {
    const additional = {
      issuesWithBounties: this.props.intl.formatMessage(messages.issuesWithBounties),
      contribution: this.props.intl.formatMessage(messages.contribution)
    }

    return additional[status]
  }

  render() {
    const { selected, additionalSelected } = this.state
    const {} = this.props
    return (
      <div>
        <FormattedMessage id="task.status.filter.all" defaultMessage="All">
          {(msg) => (
            <Chip
              style={{ marginRight: 10 }}
              onClick={() => this.handleClickAll()}
              clickable
              key={0}
              label={msg}
              sx={
                selected === 'all'
                  ? {
                      bgcolor: 'primary.main',
                      color: 'primary.contrastText',
                      '&:active': { bgcolor: 'primary.main', color: 'primary.contrastText' }
                    }
                  : {}
              }
            />
          )}
        </FormattedMessage>
        {statuses.map((status, index) => (
          <Chip
            style={{ marginRight: 10 }}
            onClick={() => this.handleListItemClick(status)}
            clickable
            key={index + 1}
            label={this.statusesDisplay(status)}
            sx={
              selected === status
                ? {
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    '&:active': { bgcolor: 'primary.main', color: 'primary.contrastText' }
                  }
                : {}
            }
          />
        ))}
        <span
          style={{
            flexGrow: 1,
            flexBasis: 'auto',
            margin: '.25em 0',
            padding: '5px 0.3em',
            borderLeft: '1px solid #CCC',
            backgroundColor: '#FFF'
          }}
        />
        {additionalStatuses.map((status, index) => (
          <Chip
            style={{ marginRight: 10 }}
            onClick={() => this.handleListAdditionalStatusesClick(status)}
            clickable
            key={index + 1}
            label={this.additionalStatusDisplay(status)}
            sx={
              additionalSelected === status
                ? {
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    '&:active': { bgcolor: 'primary.main', color: 'primary.contrastText' }
                  }
                : {}
            }
          />
        ))}
      </div>
    )
  }
}

export default injectIntl(withRouter(TaskStatusFilter))
