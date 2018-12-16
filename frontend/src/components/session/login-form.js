import React, { Component } from 'react'
import TextField from 'material-ui/TextField'
import { withStyles } from 'material-ui/styles'
import purple from 'material-ui/colors/purple'
import Button from 'material-ui/Button'

const styles = theme => ({
  cssLabel: {
    '&$cssFocused': {
      color: purple[500],
    },
  },
  cssFocused: {},
  cssUnderline: {
    '&:after': {
      borderBottomColor: purple[500]
    },
  },
  cssOutlinedInput: {
    '&$cssFocused $notchedOutline': {
      borderColor: purple[500]
    },
  },
  notchedOutline: {},
  margins: {
    top: 20,
    bottom: 60
  },
  button: {
    marginRight: 20
  },
  center: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
})

class LoginForm extends Component {

  handleChange = name => event => {
    console.log(name, event.target.value)
  }

  render() {
    const { classes } = this.props
    return (
      <form noValidate autoComplete="off" style={{marginBottom: 40}}>
        <div className={classes.margins}>
          <TextField
            fullWidth
            InputLabelProps={{
              classes: {
                root: classes.cssLabel,
                focused: classes.cssFocused,
              },
            }}
            InputProps={{
              classes: {
                root: classes.cssOutlinedInput,
                focused: classes.cssFocused,
                notchedOutline: classes.notchedOutline,
              },
            }}
            label="E-mail"
            variant="outlined"
            id="custom-css-outlined-input"
          />
        </div>
        <div className={classes.margins}>
          <TextField
            fullWidth
            InputLabelProps={{
              classes: {
                root: classes.cssLabel,
                focused: classes.cssFocused,
              },
            }}
            InputProps={{
              classes: {
                root: classes.cssOutlinedInput,
                focused: classes.cssFocused,
                notchedOutline: classes.notchedOutline,
              },
            }}
            type="password"
            label="Password"
            variant="outlined"
            id="custom-css-outlined-input"
          />
        </div>
        <div className={classes.center} style={{marginTop: 30}}>
          <Button variant="raised" color="primary" className={classes.button}>
            Sign in
          </Button>
          <Button variant="raised" color="primary" className={classes.button}>
            Sign up
          </Button>
        </div>
      </form>
    )
  }
}

export default withStyles(styles)(LoginForm)