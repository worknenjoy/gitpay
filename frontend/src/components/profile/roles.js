/* eslint-disable react/jsx-no-duplicate-props */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import funder from '../../images/bounty.png'
import contributor from '../../images/sharing.png'
import maintainer from '../../images/notifications.png'

import {
  withStyles,
  Paper,
  Grid,
  Typography,
  Checkbox,
  Card,
  CardMedia,
  CardContent,
  CardActions
} from '@material-ui/core'
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank'
import CheckBoxIcon from '@material-ui/icons/CheckBox'

const styles = theme => ({
  row: {
    width: '100%',
    [theme.breakpoints.down('lg')]: {
      flexDirection: 'column',
      width: '50%',
      margin: 'auto'
    },
    [theme.breakpoints.up('lg')]: {
      flexDirection: 'row',
      width: '100%',
      padding: '0 5% 3% 5%',
      margin: '0 5% 0',
      alignItems: 'center',
    },
  },
  bigRow: {
    margin: '0 5% 0',
    padding: '0 0% 3% 5%',
    '& h1': {
      fontWeight: '500',
      fontFamily: 'roboto',
    },
    '& p': {
      color: 'gray',
      fontSize: '18px'
    }
  },
  rowList: {
    [theme.breakpoints.down('lg')]: {
      margin: '0 0% 10% 0',
    },
    [theme.breakpoints.up('lg')]: {
      margin: '0 5% 0% 0',
    }
  },
  rowContent: {
    borderRadius: 0,
    height: '100%',
    '& div': {
      width: '100%',
      height: '100%'
    },
    '& img': {
      backgroundColor: '#263238',
      objectFit: 'cover',
      width: '100%',
      height: '100%'
    }
  },
  media: {
    height: '100%'
  },
  rootLabel: {
    padding: '5px 16px 0px',
    backgroundColor: '#455a64',
    '& h5': {
      color: 'white',
    }
  },
  action: {
    alignItems: 'flex-start',
    paddingTop: '0 ',
    backgroundColor: '#455a64',
    '& p': {
      padding: '0 10px 0 15px',
      float: 'left',
      width: '90%',
      alignItems: 'center',
      color: '#c7ced1',
      wordWrap: 'break-word',
      whiteSpace: 'pre-wrap',
      fontSize: '1rem'
    },
    '& span': {
      paddingTop: 0,
      paddingLeft: 0,
      '& svg': {
        backgroundColor: 'white'
      }
    }
  },
  infoItem: {
    paddingLeft: '10px',
    backgroundColor: '#455a64',
    display: 'flex',
    flexDirection: 'row',
    '& Checkbox': {
      marginRight: '0px',
      backgroundColor: 'white'
    }
  },
  menuItem: {
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    padding: '0 0 2px',
    '& h4': {
      paddingTop: '10px',
      paddingBottom: '5px',
      margin: 0,
      fontSize: '18px'
    },
    '& p': {
      width: '100%',
      marginTop: '0px',
      marginBottom: '0px'
    },
  },
  buttons: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  cButton: {
    border: 'none',
    backgroundColor: 'transparent',
    color: '#00b58e',
    fontWeight: 'bold',
    fontFamily: 'arial',
    '& button:focus': {
      outline: 'none'
    }
  },
  sButton: {
    border: 0,
    margin: '0 4% 0 4%',
    padding: '10px 60px 10px',
    backgroundColor: '#00b58e',
    fontSize: '14px',
    height: '20%',
    color: '#FFFFFF',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontFamily: 'roboto'
  }
})

class Roles extends Component {
  constructor (props) {
    super(props)
    // eslint-disable-next-line no-console
    console.dir('where is u', props)
    this.state = {
      selectedRoles: this.props.roles.name != null && this.props.roles.name.length > 0 ? this.props.roles.name.split(',') : [],
      save: false
    }
  }
    componentDidUpdate = (prevProps, prevState) => {
      if (prevProps.roles.name !== prevState.selectedRoles.join(',') && this.state.save === true) {
        this.handleSave(true)
        // eslint-disable-next-line no-console
        console.log(prevState.selectedRoles.join(','), this.state)
      }
    }
      handleRoleClick = (item) => {
        let data = this.state.selectedRoles
        if (!this.isRoleSelected(item)) {
          data.push(item)
        }
        else {
          data.splice(data.indexOf(item), 1)
        }

        this.setState({
          selectedRoles: data
        })
      }
      isRoleSelected = (item) => {
        return this.state.selectedRoles.indexOf(item) > -1
      }
      handleRemoveRole = (item) => {
        if (this.isRoleSelected(item)) {
          this.handleRoleClick(item)
        }
      }
      handleCancelClick = () => {
        this.reloadPreferences()
      }

      reloadPreferences = () => {
        this.setState({
          save: false, selectedRoles: this.props.roles.name != null && this.props.roles.name.length > 0 ? this.props.roles.name.split(',') : []
        })
      }

      handleSaveClick = () => {
        this.setState({ save: true })
      }

      handleSave = async (fetchRoles = false) => {
        // prevent blink
        this.props.roles.name = await this.state.selectedRoles.join(',')

        this.props.updateRoles({
          name: this.state.selectedRoles.join(','),
        }).then(() => {
          fetchRoles && this.props.fetchRoles()
        })
      }

      render () {
        // eslint-disable-next-line no-unused-vars
        const { classes, user, preferences, roles, organizations } = this.props
        // const classes = styles();
        return (
          <React.Fragment>
            <div className={ classes.bigRow }>
              <h1>Who are you?</h1>
              <p>Tempor veniam est id occaecat. Duis aute consectetur sunt ea laborum reprehenderit elit excepteur ex laborum culpa. Labore voluptate do commodo eiusmod minim sint cupidatat quis
              </p>
            </div>
            <Grid container className={ classes.row } direction='row' alignItems='strech'>
              <Grid item xs={ 1 } className={ classes.rowList } xs>
                <Paper>
                  <Card className={ classes.rowContent } variant='outlined'>
                    <CardMedia>
                      <img src={ funder } />
                    </CardMedia>
                    <CardContent className={ classes.rootLabel }>
                      <Typography variant='h5' >
                        Funder
                      </Typography>
                    </CardContent>
                    <CardActions className={ classes.action }>
                      <Typography variant='body2' color='textSecondary' component='p' noWrap>
                        You will mostly fund issues
                      </Typography>
                      <Checkbox
                        icon={ <CheckBoxOutlineBlankIcon fontSize='large' style={ { color: 'transparent' } } /> }
                        checkedIcon={ <CheckBoxIcon color='white' fontSize='large' /> }
                        color='primary'
                        inputProps={ { 'aria-label': 'secondary checkbox' } }
                        checked={ this.isRoleSelected('funder') }
                        onClick={ () => this.handleRoleClick('funder') }
                      />
                    </CardActions>
                  </Card>
                </Paper>
              </Grid>
              <Grid item xs={ 1 } className={ classes.rowList } xs>
                <Paper>
                  <Card className={ classes.rowContent } variant='outlined'>
                    <CardMedia>
                      <img src={ contributor } />
                    </CardMedia>
                    <CardContent className={ classes.rootLabel }>
                      <Typography variant='h5'>
                        Contributor
                      </Typography>
                    </CardContent>
                    <CardActions className={ classes.action }>
                      <Typography variant='body2' color='textSecondary' component='p' noWrap>
                        You will solve issues
                      </Typography>
                      <Checkbox
                        icon={ <CheckBoxOutlineBlankIcon fontSize='large' style={ { color: 'transparent' } } /> }
                        checkedIcon={ <CheckBoxIcon color='white' fontSize='large' /> }
                        color='primary'
                        inputProps={ { 'aria-label': 'secondary checkbox' } }
                        checked={ this.isRoleSelected('contributor') }
                        onClick={ () => this.handleRoleClick('contributor') }
                      />
                    </CardActions>
                  </Card>
                </Paper>
              </Grid>
              <Grid item xs={ 1 } className={ classes.rowList } xs>
                <Paper>
                  <Card className={ classes.rowContent } variant='outlined'>
                    <CardMedia>
                      <img src={ maintainer } />
                    </CardMedia>
                    <CardContent className={ classes.rootLabel }>
                      <Typography variant='h5'>
                        Maintainer
                      </Typography>
                    </CardContent>
                    <CardActions className={ classes.action }>
                      <Typography variant='body2' color='textSecondary' component='p' noWrap>
                        You have a project
                      </Typography>
                      <Checkbox
                        icon={ <CheckBoxOutlineBlankIcon fontSize='large' style={ { color: 'transparent' } } /> }
                        checkedIcon={ <CheckBoxIcon color='white' fontSize='large' /> }
                        color='primary'
                        inputProps={ { 'aria-label': 'secondary checkbox' } }
                        checked={ this.isRoleSelected('maintainer') }
                        onClick={ () => this.handleRoleClick('maintainer') }
                      />
                    </CardActions>
                  </Card>
                </Paper>
              </Grid>
            </Grid>

            <div className={ classes.bigRow }>
              <p>Tempor veniam est id occaecat. Duis aute consectetur sunt ea laborum reprehenderit elit excepteur ex laborum culpa. Labore voluptate do commodo eiusmod minim sint cupidatat quis
              </p>
            </div>
            <div className={ classes.buttons }>
              <button onClick={ () => this.handleCancelClick() } className={ classes.cButton }>CANCEL</button>
              <button onClick={ () => this.handleSaveClick() } className={ classes.sButton }>SAVE</button>
            </div>
          </React.Fragment>
        )
      }
}

Roles.PropTypes = {
  classes: PropTypes.object.isRequired,
  preferences: PropTypes.string,
  language: PropTypes.string,
  updateUser: PropTypes.func,
  roles: PropTypes.object,
  fetchPreferences: PropTypes.func
}

export default withStyles(styles)(Roles)
