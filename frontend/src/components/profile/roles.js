/* eslint-disable */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import funder from '../../images/funder.png'
import contributor from '../../images/contributor.png'
import maintainer from '../../images/maintainer.png'

import {
  withStyles,
  Paper,
  Grid,
  Typography,
  Checkbox,
  Switch,
  Menu,
  MenuItem,
  Button,
  Container,
  Box,
  FormControlLabel
} from '@material-ui/core'
import LanguageIcon from '@material-ui/icons/Language'
import { LabelButton, StyledAvatarIconOnly } from '../topbar/TopbarStyles'

import { FormattedMessage, injectIntl } from 'react-intl'
import { createClassExpression } from 'typescript'

const styles = theme => ({
row:{
    padding : '0 0 0 5%',
    margin : '0 0 5% 5%',
    alignItems:'center',
    // justifyContent:'center'
    width:'100%'
},
bigRow:{
margin:'0 5% 0',
padding:'0 5% 3% 5%',
'& h1':{
    fontWeight:'200'
},
'& p':{
    color:'gray',
    fontSize:'18px'
}
},
rowList:{
    margin:'0 5% 0 0',
},
rowContent:{
border:'2px solid gray',
height:'100%',
'& img':{
    width:'100%',
    height:'100%'
},
},
infoItem:{    
    paddingLeft:'10px',
    backgroundColor:'#606060',
    display:'flex',
    flexDirection:'row',    
    '& Checkbox':{
        marginRight:'0px',
        backgroundColor :'white'
    }
},
menuItem:{
    color:'white',
    display:'flex',
    flexDirection:'column',    
    width:'100%',
    padding : '0 0 2px',
    '& h4':{
        paddingTop: '10px',
        paddingBottom: '5px',
        margin:0,
        fontSize:'18px'
    },
    '& p':{
        // paddingRight:'10px',
        width:'100%',
        marginTop: '0px',
        marginBottom: '0px'
    },    
},
altButton:{
    float:'right',
    padding:'0 10% 0 0',
    '& a':{
        color:'#00b58e',
        margin:'0 25px 0 0',
        fontSize:'14px',
        fontWeight:'600'
    },
    '& button':{        
        border:0,
        margin:'0 0 0 15px',
        padding:'10px 70px 10px',
        backgroundColor:'#00b58e',
        fontSize:'14px',
        fontWeight:'200',
        height:'20%',
        color:'#FFFFFF',
        cursor:'pointer',
        marginLeft:'10px'
    }
}
})

class Roles extends Component {
  render () {
    const { classes, user, preferences, roles, organizations } = this.props
    //const classes = styles();
    return (
      <React.Fragment>
        <div className={classes.bigRow}>
          <h1>Who are you?</h1>
          <p>Tempor veniam est id occaecat. Duis aute consectetur sunt ea laborum reprehenderit elit excepteur ex laborum culpa. Labore voluptate do commodo eiusmod minim sint cupidatat quis
          </p>
        </div>
        <Grid container className={classes.row} direction="row"  alignItems="center">
          <Grid item  xs={3} className={classes.rowList}>
              <div className={classes.rowContent}>
              <img src={funder}></img>
              <div className={classes.infoItem}>             
              <div className={classes.menuItem}>
                <h4>Funder</h4>
                  <p>You will mostly fund issues</p>                  
                </div>
                <Checkbox
                        color="primary"
                        inputProps={{ 'aria-label': 'secondary checkbox' }}
                    />
              </div>         
              </div>     
          </Grid>
          <Grid item  xs={3} className={classes.rowList}>
              <div className={classes.rowContent} >
          <img src={contributor}></img>
          <div className={classes.infoItem}>              
              <div className={classes.menuItem}>
              <h4>Contributor</h4>
                  <p>You will solve issues</p>                  
              </div>
              <Checkbox
                        color="primary"
                        inputProps={{ 'aria-label': 'secondary checkbox' }}
                    />
              </div>
              </div>
          </Grid>
          <Grid item  xs={3} className={classes.rowList}>
              <div className={classes.rowContent}>
          <img src={maintainer}></img>
          <div className={classes.infoItem}>
              
              <div className={classes.menuItem}>
              <h4>Maintainer</h4>
                  <p>You have a project</p>                 
              </div>
              <Checkbox
                        color="primary"
                        inputProps={{ 'aria-label': 'secondary checkbox' }}
                    />                  
              </div>
              </div>
          </Grid>
        </Grid>
        <div className={classes.bigRow}>          
          <p>Tempor veniam est id occaecat. Duis aute consectetur sunt ea laborum reprehenderit elit excepteur ex laborum culpa. Labore voluptate do commodo eiusmod minim sint cupidatat quis
          </p>
          </div>
          <div className={classes.altButton}>
              <a>CANCEL</a>
              <button >SAVE</button>
          </div>
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(Roles)
/* eslint-enable */