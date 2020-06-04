/* eslint-disable*/
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Route, Switch, HashRouter } from 'react-router-dom'
import { injectIntl, FormattedMessage } from 'react-intl'

import {
  Grid,
  Avatar,
  Typography,
  Button,
  Paper,
  withStyles,
  AppBar,
  TextField,
  InputAdornment,
  Link,
  Checkbox
} from '@material-ui/core'
import {
  DeviceHub,
  LibraryBooks,
  CreditCard,
  Tune,
  Person,
  ArrowBack,
  Settings
} from '@material-ui/icons'

import classNames from 'classnames'
import nameInitials from 'name-initials'

import api from '../../consts'

import PersonIcon from '@material-ui/icons/Person';
import EmailIcon from '@material-ui/icons/Email';
import LockIcon from '@material-ui/icons/Lock';

const logoGithub = require('../../images/github-logo.png')
const logoBitbucket = require('../../images/bitbucket-logo.png')

const styles = theme => ({
header:{
    display:'flex',
    flexDirection:'column',
    justifyContent:'center',
    alignItems:'center',
    padding:'10% 0 3% 0',
    '& p':{
        fontSize:'1.5rem'
    }
},
divider:{
    display:'flex',
    flexDirection:'row',
    justifyContent:'center',
    fontSize:'1.25rem',
    '& hr':{
        width:'10%',
        height:'5%',
        margin:'1.25% 1% 0 1%',
        color:'rgb(220,220,220,0.3)'
    }
},
providerBtns:{
    display:'flex',
    justifyContent:'center',
    '& a':{
        margin:'2% 1%',
        width:'25%',
        fontSize:'1.25rem',
        backgroundColor:'#1239ff'
    },
    '& a:hover':{
        backgroundColor:'#1239ff'
    }
},
form:{
    '& form':{
        display:'flex',
        flexDirection:'column',
        margin:'2% 0',
        justifyContent:'center',
        alignItems:'center',
        '& > div':{
            margin:'0.5% 0',
            width:'55%'
        }
    }
},
checkboxes:{
    display:'flex',
    flexDirection:'column',
    margin:'0% 0 0 23%',
    '& button':{
        width:'71%',
        margin:'2% 0 0 0',
        fontSize:'1.2rem',
        backgroundColor:'#1239ff'
    },
    '& button:hover':{
        backgroundColor:'#1239ff'
    }
},
tnc:{
    display:'flex',
    flexDirection:'row',
    '& span':{
        paddingTop:'0'
    }
},
newsletter:{
    display:'flex',
    flexDirection:'row',
    '& span':{
        paddingTop:'0'
    }
},
})

class AccountSettings extends Component{
    state={
        name:'',
        email:'',
        password:'',
        confirmPassword:'',
        provider:this.props.user.provider||'',
        save:false,
        checkedConditions:false,
        newsletter:false
    }
    componentDidUpdate = () => {
        if (this.state.name !== '' &&
            this.state.password !== '' &&
            this.state.email !== '' &&
            this.state.save === true &&
            this.state.checkedConditions === true
            ) {
          this.handleSave()
      }
    }
    handleName = (element)=>{
        this.setState({name:element.target.value})
    }
    handleEmail = (element)=>{
        this.setState({email:element.target.value})
    }
    handlePassword = (element)=>{
        this.setState({password:element.target.value})
    }
    handleConfirmPassword = (element)=>{
        this.setState({confirmPassword:element.target.value})
    }
    handleProvider = (element)=>{
        this.setState({provider:element.target.value})
    }
    handleUpdate = (e)=>{
        if(this.state.checkedConditions === true){
            e.preventDefault()
            this.setState({save:true})
        }
    }
    handleIsConditionChecked = (e) =>{
        if(this.state.checkedConditions !== true)
           this.setState({checkedConditions:true})
        else
            this.setState({checkedConditions:false})
    }
    handleIsnewsletterChecked = (e) =>{
        if(this.state.newsletter !== true)
           this.setState({newsletter:true})
        else
            this.setState({newsletter:false})
    }
    handleSave =()=>{
        if(this.state.password === this.state.confirmPassword){
            this.setState({password:this.state.password})
        }
        this.props.updateUser(this.props.user.id, {
            name:this.state.name,
            email:this.state.email,
            password:this.state.password
          })
        //   .then(() => {
        //     fetchPreferences && this.props.fetchPreferences(this.props.user.id)
        //   })
    }
    render(){
        console.dir(this.state,this.props)
        const { classes, user, preferences, roles, organizations } = this.props        
        return(
            <React.Fragment>
                <div className={classes.header}>
                <Typography variant='h4' color='textPrimary' component='p' wrap>
                    CHANGE YOUR
                </Typography>
                <Typography variant='h4' color='textPrimary' component='p' wrap>
                    ACCOUNT SETUP
                </Typography>
                </div>
                <div className={classes.divider}>
                    <hr/>
                    <Typography variant='h5' color='textSecondary' component='p' wrap>
                        PROVIDER
                    </Typography>
                    <hr/>
                </div>
                <div className={classes.providerBtns}>
                <Button variant="contained" color="primary" disabled={ user.provider === 'github' } href={ `${api.API_URL}/authorize/github` }>
                    GITHUB
                </Button>
                <Button variant="contained" color="primary" disabled={ user.provider === 'bitbucket' } href={ `${api.API_URL}/authorize/bitbucket` }>
                    BITBUCKET
                </Button>
                </div>
                <div className={classes.divider}>
                    <hr/>
                    <Typography variant='h5' color='textSecondary' component='p' wrap>
                        OR
                    </Typography>
                    <hr/>
                </div>
                <div className={classes.form}>
                    <form>
                        <TextField id="outlined-basic" label="Full Name" variant="outlined"  onChange = {this.handleName}
                        InputProps={{                           
                            startAdornment: (
                            <InputAdornment position="start">
                            <PersonIcon style={{ color: '#2a60e4' }} />
                            </InputAdornment>),}}/>
                        <TextField id="outlined-basic" label="Email Address" variant="outlined" onChange = {this.handleEmail}
                        InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <EmailIcon style={{ color: '#2a60e4' }} />
                              </InputAdornment>
                            ),
                          }}/>
                        <TextField id="outlined-password-input" label="Password" variant="outlined" onChange = {this.handlePassword}
                        type="password"
                        InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <LockIcon style={{ color: '#2a60e4' }} />
                              </InputAdornment>
                            ),
                          }}/>
                        <TextField id="outlined-password-input" label="Confirm Password" variant="outlined" onChange = {this.handleConfirmPassword}
                        type="password"
                        InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <LockIcon style={{ color: '#2a60e4' }} />
                              </InputAdornment>
                            ),
                          }}/>
                    </form>
                </div>
                <div className={classes.checkboxes}>
                    <div className={classes.tnc}>
                        <Checkbox onChange={ this.handleIsConditionChecked }  inputProps={{ 'aria-label': 'uncontrolled-checkbox' }} />
                        <Typography variant='subtitle1'  color='textPrimary' component='p' wrap>
                            I agree to the&nbsp; <Link href="#" style={{ color: '#3e6ee6' }} >T & C's</Link> &nbsp;and&nbsp; <Link href="#" style={{ color: '#3e6ee6' }} >Privacy Policy</Link>
                        </Typography>
                    </div>
                    <div className={classes.newsletter}>                        
                        <Checkbox onChange={ this.handleIsnewsletterChecked } inputProps={{ 'aria-label': 'uncontrolled-checkbox' }} />
                        <Typography variant='subtitle1' color='textPrimary' component= 'p' wrap>
                            Sign up to the newsletter
                        </Typography>
                    </div>
                    <Button variant="contained" color="primary" onClick={this.handleUpdate}>
                        UPDATE ACCOUNT
                    </Button>
                </div>
            </React.Fragment>
            

            
        );
    }
}
export default injectIntl(withStyles(styles)(AccountSettings))