import React from 'react'
import PropTypes from 'prop-types'
import Breadcrumbs from '@material-ui/core/Breadcrumbs'
import Link from '@material-ui/core/Link'
import NavigateNextIcon from '@material-ui/icons/NavigateNext'
import ReactPlaceholder from 'react-placeholder'
import { RectShape } from 'react-placeholder/lib/placeholders'
import {
  Typography,
  Button,
  Chip,
  Grid,
  withStyles
} from '@material-ui/core'

import { injectIntl, FormattedMessage } from 'react-intl'

import {
  Redeem as RedeemIcon,
  Done as DoneIcon,
} from '@material-ui/icons'

import styled from 'styled-components'
import media from 'app/styleguide/media'

import Constants from '../../consts'
import { PaymentHeader } from '../Cards/PaymentHeaderCard'

const logoGithub = require('../../images/github-logo.png')
const logoBitbucket = require('../../images/bitbucket-logo.png')

const TaskHeaderContainer = styled.div`
  box-sizing: border-box;
  background: black;
  padding: 1rem 3rem 1rem 3rem;
  position: relative;
  margin: -2rem -3rem 1rem -3rem;

  border-top: 1px solid #999;

  ${media.phone`
    margin: -1rem -1rem 1rem -1rem;
    padding: 1rem;

    & h1 {
      font-size: 1.75rem;
    }
  `}
`

const Tags = styled.div`
  display: inline-block;

  ${media.phone`
    display: block;
    margin-top: 1rem;
    margin-left: -20px;
  `}
`

const styles = theme => ({
  root: {
    marginBottom: 20,
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
  breadcrumb: {
    color: '#bbb'
  },
  chipStatus: {
    marginLeft: 20,
    verticalAlign: 'middle',
    backgroundColor: theme.palette.primary.light
  },
  chipStatusPaid: {
    marginLeft: 0,
    verticalAlign: 'middle',
    backgroundColor: theme.palette.primary.light
  },
  button: {
    width: 100,
    font: 10
  },
  gutterRight: {
    marginRight: 10
  }
})

class TaskHeader extends React.Component {
  goToProjectRepo = (e, url) => {
    e.preventDefault()
    window.open(url, '_blank')
  }

  handleBackToTaskList = (e) => {
    e.preventDefault()
    window.location.assign('/#/tasks/explore')
  }

  render () {
    const { classes, task } = this.props

    const headerPlaceholder = (
      <div className='line-holder'>
        <RectShape
          color='white'
          style={ { marginLeft: 20, marginTop: 20, width: 300, height: 20 } }
        />
      </div>
    )

    return (
      <TaskHeaderContainer>
        <Grid container spacing={ 9 }>
          <Grid item xs={ 12 } sm={ 12 } md={ 6 }>
            { task.data.metadata &&
            <Typography variant='subheading' style={ { color: '#bbb' } }>
              <ReactPlaceholder showLoadingAnimation type='text' rows={ 1 }
                ready={ task.completed }>
                <div style={ { marginTop: 20 } } className={ classes.root }>
                  { task.data.project ? (
                    <Breadcrumbs aria-label='breadcrumb' separator={ <NavigateNextIcon fontSize='small' style={ { color: 'white' } } /> }>
                      <Link className={ classes.breadcrumb } href='/' color='inherit' onClick={ this.handleBackToTaskList }>
                        <Typography variant='subheading'>
                          <FormattedMessage id='task.title.navigation' defaultMessage='Explore issues' />
                        </Typography>
                      </Link>
                      <Link className={ classes.breadcrumb } href='/' color='inherit' onClick={ (e) => this.goToProjectRepo(e, task.data.metadata.ownerUrl) }>
                        <Typography variant='subheading'>
                          { task.data.project.organization.name }
                        </Typography>
                      </Link>
                      <Link href={ `/#/organizations/${task.data.project.OrganizationId}/projects/${task.data.project.id}` } className={ classes.breadcrumb } color='inherit'>
                        <Typography variant='subheading'>
                          { task.data.project.name }
                        </Typography>
                      </Link>
                    </Breadcrumbs>
                  ) : (
                    <Breadcrumbs aria-label='breadcrumb' separator={ <NavigateNextIcon fontSize='small' style={ { color: 'white' } } /> }>
                      <Link className={ classes.breadcrumb } href='/' color='inherit' onClick={ this.handleBackToTaskList }>
                        <Typography variant='subheading'>
                          <FormattedMessage id='task.title.navigation' defaultMessage='Explore issues' />
                        </Typography>
                      </Link>
                      <Link className={ classes.breadcrumb } href='/' color='inherit' onClick={ (e) => this.goToProjectRepo(e, task.data.metadata.ownerUrl) }>
                        <Typography variant='subheading'>
                          { task.data.metadata.company }
                        </Typography>
                      </Link>
                      <Link className={ classes.breadcrumb } href='/' color='inherit' onClick={ (e) => this.goToProjectRepo(e, task.data.metadata.repoUrl) }>
                        <Typography variant='subheading'>
                          { task.data.metadata.projectName }
                        </Typography>
                      </Link>
                    </Breadcrumbs>
                  ) }
                </div>
              </ReactPlaceholder>
            </Typography>
            }
            <ReactPlaceholder customPlaceholder={ headerPlaceholder } showLoadingAnimation
              ready={ task.completed }>
              <Typography variant='h4' color='primary' align='left' gutterBottom>
                <a className={ classes.white } href={ task.data.url }>
                  { task.data.title }
                </a>
                <Tags>
                  <Button
                    style={ { marginLeft: 10, marginRight: 10 } }
                    href={ task.data.url }
                    variant='outlined'
                    color='primary'
                    size='small'
                  >
                    <span className={ classes.gutterRight }>See on { task.data.provider } </span>
                    <img width='16' src={ task.data.provider === 'github' ? logoGithub : logoBitbucket } />
                  </Button>
                  <Chip
                    style={ { marginRight: 10 } }
                    label={ this.props.intl.formatMessage(Constants.STATUSES[task.data.status]) }
                    className={ classes.chipStatus }
                    onDelete={ this.handleStatusDialog }
                    onClick={ this.handleStatusDialog }
                    deleteIcon={ <DoneIcon /> }
                  />

                  { task.data.paid && (
                    <FormattedMessage id='task.status.label.paid' defaultMessage='Paid'>
                      { (msg) => (
                        <Chip
                          style={ { marginRight: 10 } }
                          label={ msg }
                          className={ classes.chipStatusPaid }
                          onDelete={ this.handleTaskPaymentDialog }
                          onClick={ this.handleTaskPaymentDialog }
                          deleteIcon={ <RedeemIcon /> }
                        />
                      ) }
                    </FormattedMessage>
                  ) }
                </Tags>

              </Typography>
            </ReactPlaceholder>
          </Grid>
          <Grid item xs={ 12 } sm={ 12 } md={ 6 } className={ classes.paymentInfo }>
            <PaymentHeader user={ this.props.user }>{ task }</PaymentHeader>
          </Grid>
        </Grid>

      </TaskHeaderContainer>
    )
  }
}

TaskHeader.propTypes = {
  classes: PropTypes.object.isRequired,
  task: PropTypes.object
}

export default injectIntl(withStyles(styles)(TaskHeader))
