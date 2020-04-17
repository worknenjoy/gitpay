import React, { Component } from 'react'
import PropTypes from 'prop-types'

import {
  Grid,
  withStyles,
} from '@material-ui/core'

import TopBarContainer from '../../containers/topbar'
import Bottom from '../bottom/bottom'

import { Page, PageContent } from 'app/styleguide/components/Page'

import TaskListContainer from '../../containers/task-list'

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  altButton: {
    marginRight: 10
  },
  bigRow: {
    marginTop: 40
  },
  row: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: 10
  },
  rowList: {
    marginTop: 10,
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column'
  },
  rowContent: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  infoItem: {
    width: '100%',
    textAlign: 'center'
  },
  menuContainer: {
    marginBottom: 40,
    marginRight: 20,
    marginLeft: 20,
    width: '100%'
  },
  menuItem: {
    '&:focus': {
      backgroundColor: theme.palette.primary.main,
      '& $primary, & $icon': {
        color: theme.palette.common.white
      }
    }
  },
  primary: {},
  icon: {
    marginRight: 5
  }
})

class TaskExplorer extends Component {
  render () {
    const { classes } = this.props

    return (
      <Page>
        <TopBarContainer />
        <PageContent>
          <Grid container className={ classes.root } spacing={ 3 }>
            <Grid item xs={ 12 } md={ 12 }>
              <TaskListContainer />
            </Grid>
          </Grid>
        </PageContent>
        <Bottom classes={ classes } />
      </Page>
    )
  }
}

TaskExplorer.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(TaskExplorer)
