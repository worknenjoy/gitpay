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
  Card,
  CardMedia,
  CardContent,
  CardActions
} from '@material-ui/core'
import LanguageIcon from '@material-ui/icons/Language'
import { LabelButton, StyledAvatarIconOnly } from '../topbar/TopbarStyles'

import { FormattedMessage, injectIntl } from 'react-intl'
import { createClassExpression } from 'typescript'

const styles = theme => ({
row:{
    padding : '0 5% 3% 5%',
    margin : '0 5% 0',
    alignItems:'center',
    // justifyContent:'center'
    width:'100%',

},
bigRow:{
margin:'0 5% 0',
padding:'0 0% 3% 5%',
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
// border:'2px solid gray',
borderRadius:0,
height:'100%',
'& img':{
    width:'100%',
    height:'100%'
}
},
rootLabel:{
    padding:'5px 16px 0px',
    backgroundColor:'gray',
    '& h5':{
        color:'white',
    }
},
action:{
    // justifyContent:'center',
    paddingTop:'0 ',
    backgroundColor:'gray',
    '& p':{
        padding:'0 10px 0 15px',
        float:'left',
        width:'90%',
        alignItems:'center',
        color:'white'
    }
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
buttons:{
    width:'100%',
    display:'flex',
    justifyContent:'flex-end',    
},
cButton:{
    border:'none',
    backgroundColor:'transparent',
    color:'#00b58e',
    fontWeight:'bold'
},
sButton:{   
        border:0,
        margin:'0 4% 0 4%',
        padding:'10px 60px 10px',
        backgroundColor:'#00b58e',
        fontSize:'14px',
        fontWeight:'200',
        height:'20%',
        color:'#FFFFFF',
        cursor:'pointer',
        fontWeight:'bold'
}
})

class Roles extends Component {
    constructor (props) {
        super(props)
        console.dir('where is u',props)
    }
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
        <Grid container className={classes.row} direction="row"  alignItems="strech">        
          <Grid item  xs={1} className={classes.rowList} xs>
          <Paper>
                 <Card className={classes.rowContent} variant="outlined">
                    <CardMedia>
                    <img src={funder}></img>
                    </CardMedia>
                    <CardContent className={classes.rootLabel}>
                        <Typography variant="h5" >
                            Funder
                        </Typography>                   
                    </CardContent>
                    <CardActions className={classes.action}>
                    <Typography variant="body2" color="textSecondary" component="p" noWrap>
                            You will mostly fund issues.
                    </Typography>
                        <Checkbox
                            color="primary"
                            inputProps={{ 'aria-label': 'secondary checkbox' }}
                        />
                    </CardActions>
                 </Card>
                 </Paper>
          </Grid>          
          <Grid item  xs={1} className={classes.rowList} xs>
          <Paper>
              <Card className={classes.rowContent} variant="outlined">
                    <CardMedia>
                    <img src={contributor}></img>
                    </CardMedia>
                    <CardContent className={classes.rootLabel}>
                        <Typography variant="h5">
                            Contributor
                        </Typography>                   
                    </CardContent>
                    <CardActions className={classes.action}>
                    <Typography variant="body2" color="textSecondary" component="p" noWrap>
                            You will solve issues.
                    </Typography>
                        <Checkbox
                            color="primary"
                            inputProps={{ 'aria-label': 'secondary checkbox' }}
                        />
                    </CardActions>
                 </Card>
                 </Paper>
          </Grid>          
          <Grid item  xs={1} className={classes.rowList} xs>
          <Paper>
              <Card className={classes.rowContent} variant="outlined">
                    <CardMedia>
                    <img src={maintainer}></img>
                    </CardMedia>
                    <CardContent className={classes.rootLabel}>
                        <Typography variant="h5">
                            Maintainer
                        </Typography>                   
                    </CardContent>
                    <CardActions className={classes.action}>
                    <Typography variant="body2" color="textSecondary" component="p" noWrap>
                            You have a project
                    </Typography>
                        <Checkbox
                            color="primary"
                            inputProps={{ 'aria-label': 'secondary checkbox' }}
                        />
                    </CardActions>
                 </Card>
                 </Paper>
          </Grid>
        </Grid>
        
        <div className={classes.bigRow}>          
          <p>Tempor veniam est id occaecat. Duis aute consectetur sunt ea laborum reprehenderit elit excepteur ex laborum culpa. Labore voluptate do commodo eiusmod minim sint cupidatat quis
          </p>
          </div>
          <div className={classes.buttons}>
             <button className={classes.cButton}>CANCEL</button>
              <button className={classes.sButton}>SAVE</button>
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
/* eslint-enable */