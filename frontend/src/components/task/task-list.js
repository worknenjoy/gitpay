import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import Paper from 'material-ui/Paper'
import Typography from 'material-ui/Typography'
import AppBar from 'material-ui/AppBar'

import Tabs, { Tab } from 'material-ui/Tabs'

import { withStyles } from 'material-ui/styles'

import RedeemIcon from 'material-ui-icons/Redeem'
import ShoppingBasket from 'material-ui-icons/ShoppingBasket'

import AssignIcon from 'material-ui-icons/Assignment'
import ActionIcon from 'material-ui-icons/CallToAction'

import CustomPaginationActionsTable from './task-table'
import TaskStatusFilter from './task-status-filter'

const styles = theme => ({
  icon: {
    backgroundColor: 'black'
  },

  rootTabs: {
    backgroundColor: theme.palette.primary.light
  }
})

class TaskList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      tab: 0
    }

    this.handleTabChange = this.handleTabChange.bind(this)
  }

  componentDidMount () {
    this.props.listTasks()
  }

  handleTabChange (event, value) {
    this.setState({ tab: value })
    switch (value) {
      case 0:
        this.props.listTasks()
        break
      case 1:
        this.props.filterTasks('userId')
        break
      case 2:
        this.props.filterTasks('Assigns')
        break
      case 3:
        this.props.filterTasks('assigned')
        break
      default:
        this.props.filterTasks()
    }
  }

  render () {
    const { classes } = this.props

    const TabContainer = props => {
      return (
        <Typography component='div' style={ { padding: 8 * 3 } }>
          { props.children }
        </Typography>
      )
    }

    return (
      <Paper elevation={ 0 }>
        <Typography variant='headline' component='h2'>
          Lista de tarefas
        </Typography>
        <Typography component='p' style={ { marginBottom: 20 } }>
          Tarefas disponíveis para desenvolvimento
        </Typography>
        <div style={{marginTop: 20, marginBottom: 20}}>
          <TaskStatusFilter onFilter={this.props.filterTasks} />
        </div>
        <div className={ classes.rootTabs }>
          <AppBar position='static' color='default'>
            <Tabs
              value={ this.state.tab }
              onChange={ this.handleTabChange }
              scrollable
              scrollButtons='on'
              indicatorColor='primary'
              textColor='primary'
            >
              <Tab value={ 0 } label='Todas tarefas' icon={ <RedeemIcon /> } />
              <Tab value={ 1 } label='Criadas por mim' icon={ <ShoppingBasket /> } />
              <Tab value={ 2 } label='Tenho interesse' icon={ <AssignIcon /> } />
              <Tab value={ 3 } label='Atribuidas a mim' icon={ <ActionIcon /> } />
            </Tabs>
          </AppBar>
          <TabContainer>
            <CustomPaginationActionsTable tasks={ this.props.tasks } />
          </TabContainer>
        </div>
      </Paper>
    )
  }
}

TaskList.propTypes = {
  classes: PropTypes.object.isRequired,
  listTasks: PropTypes.func,
  filterTasks: PropTypes.func,
  tasks: PropTypes.array
}

export default withRouter(withStyles(styles)(TaskList))
