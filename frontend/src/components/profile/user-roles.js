/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable react/jsx-no-duplicate-props */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl'
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
      margin: 'auto'
    },
    [theme.breakpoints.up('lg')]: {
      flexDirection: 'row',
      width: '100%',
      padding: '3% 0 3% 0',
      margin: '0 0 0 0',
      alignItems: 'center',
    },
  },
  bigRow: {
    margin: '2% 5% 0 0',
    padding: '0 0 0 0',
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
      fontSize: '0.78rem'
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

const messages = defineMessages({
  saveSuccess: {
    id: 'user.role.update.success',
    defaultMessage: 'Role updated successfully'
  },
  saveError: {
    id: 'user.role.update.error',
    defaultMessage: 'We couldnt update your information properly'
  }
})

const imageMap = {
  'funding': funder,
  'contributor': contributor,
  'maintainer': maintainer
}

class Roles extends Component {
  constructor (props) {
    super(props)
    this.state = {
      selectedRoles: this.props.user.Types
    }
  }
  async componentDidMount () {
    try {
      if (this.props.roles.data.length === 0) {
        await this.props.fetchRoles()
      }
    }
    catch (e) {
      console.log(e)
    }
  }

  handleRoleClick = (event, item) => {
    let allItems = this.state.selectedRoles
    const itemExist = allItems.filter(i => i.id === item.id)
    if (itemExist.length) {
      allItems = allItems.filter(i => i.id !== item.id)
    }
    else {
      allItems.push(item)
    }
    this.setState({
      selectedRoles: allItems
    })
  }

  shouldBeChecked = (item) => {
    return !!(this.state.selectedRoles && this.state.selectedRoles.find(s => item.name === s.name))
  }

  handleCancelClick = () => {
    this.props.onClose && this.props.onClose()
  }

  handleSaveClick = async (e) => {
    e.preventDefault()
    try {
      await this.props.updateUser(this.props.user.id, {
        Types: this.state.selectedRoles
      })
      this.props.addNotification(this.props.intl.formatMessage(messages.saveSuccess))
      this.props.onClose && this.props.onClose()
    }
    catch (e) {
      console.log(e)
      this.props.addNotification(this.props.intl.formatMessage(messages.saveError))
    }
  }

  render () {
    // eslint-disable-next-line no-unused-vars
    const { classes, roles } = this.props
    return (
      <Paper elevation={ 2 } style={ { padding: '10px 20px 20px 20px' } }>
        <div className={ classes.bigRow }>
          <Typography variant='h5' noWrap>
            <FormattedMessage id='user.type.title' defaultMessage='What type of user are you?' />
          </Typography>
          <Typography variant='body2' color='textSecondary' component='p' noWrap>
            <FormattedMessage id='user.type.description' defaultMessage='Define how you will use Gitpay. You can choose multiple types of user roles you want.' />
          </Typography>
        </div>
        <Grid container className={ classes.row } direction='row' alignItems='strech'>
          { roles.data && roles.data.map(r => {
            return (
              <Grid item xs={ 12 } md={ 3 } spacing={ 2 } className={ classes.rowList }>
                <Paper>
                  <Card className={ classes.rowContent } variant='outlined'>
                    <CardMedia>
                      <img src={ imageMap[r.name] } />
                    </CardMedia>
                    <CardContent className={ classes.rootLabel }>
                      <Typography variant='h5' >
                        { r.label }
                      </Typography>
                    </CardContent>
                    <CardActions className={ classes.action }>
                      <Typography variant='body2' color='textSecondary' component='p'>
                        { r.description }
                      </Typography>
                      <Checkbox
                        icon={ <CheckBoxOutlineBlankIcon fontSize='large' style={ { color: 'transparent' } } /> }
                        checkedIcon={ <CheckBoxIcon color='white' fontSize='large' /> }
                        color='primary'
                        inputProps={ { 'aria-label': r.name } }
                        checked={ this.shouldBeChecked(r) }
                        onChange={ (e) => this.handleRoleClick(e, r) }
                      />
                    </CardActions>
                  </Card>
                </Paper>
              </Grid>
            )
          }) }
        </Grid>
        <div className={ classes.buttons }>
          <button onClick={ () => this.handleCancelClick() } className={ classes.cButton }>CANCEL</button>
          <button onClick={ (e) => this.handleSaveClick(e) } className={ classes.sButton }>SAVE</button>
        </div>
      </Paper>
    )
  }
}

Roles.PropTypes = {
  classes: PropTypes.object.isRequired,
  preferences: PropTypes.string,
  language: PropTypes.string,
  updateUser: PropTypes.func,
  createRoles: PropTypes.func,
  deleteRoles: PropTypes.func,
  fetchRoles: PropTypes.func,
  roles: PropTypes.object,
  fetchPreferences: PropTypes.func,
  addNotification: PropTypes.func.isRequired,
}

export default injectIntl(withStyles(styles)(Roles))
