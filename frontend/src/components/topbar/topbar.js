import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import ReactPlaceholder from 'react-placeholder'
import { RoundShape } from 'react-placeholder/lib/placeholders'

import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog'

import Tooltip from 'material-ui/Tooltip'
import { FormControl, FormHelperText } from 'material-ui/Form'
import TextField from 'material-ui/TextField'
import Typography from 'material-ui/Typography'
import HomeIcon from 'material-ui-icons/Home'
import PlusIcon from 'material-ui-icons/Queue'
import UserIcon from 'material-ui-icons/AccountCircle'
import { withStyles } from 'material-ui/styles'

import Menu, { MenuItem } from 'material-ui/Menu'
import Button from 'material-ui/Button'
import nameInitials from 'name-initials'
import isGithubUrl from 'is-github-url'

import {
  Bar,
  Container,
  LeftSide,
  RightSide,
  Logo,
  StyledButton,
  LabelButton,
  StyledAvatar,
  OnlyDesktop,
} from './TopbarStyles'

import mainStyles from '../styles/style'

const classes = (theme) => mainStyles(theme)

import LoginButton from '../session/login-button'

const logo = require('../../images/gitpay-logo.png')
const logoGithub = require('../../images/github-logo-alternative.png')
const logoBitbucket = require('../../images/bitbucket-logo.png')


const isBitbucketUrl = (url) => {
  return url.indexOf("bitbucket") > -1
}

const styles = {
  formControl: {
    width: '100%'
  }
}

class TopBar extends Component {
  constructor (props) {
    super(props)

    this.state = {
      anchorEl: null,
      task: {
        url: {
          error: false,
          value: null
        }
      },
      provider: 'github',
      createTaskDialog: false,
      signUserDialog: false
    }

    this.handleClose = this.handleClose.bind(this)
    this.handleMenu = this.handleMenu.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSignOut = this.handleSignOut.bind(this)
    this.handleSignIn = this.handleSignOut.bind(this)
    this.handleProfile = this.handleProfile.bind(this)
    this.handleClickDialogCreateTask = this.handleClickDialogCreateTask.bind(this)
    this.handleClickDialogCreateTaskClose = this.handleClickDialogCreateTaskClose.bind(this)
    this.handleCreateTask = this.handleCreateTask.bind(this)
    this.onChange = this.onChange.bind(this)
    this.handleClickDialogSignUser = this.handleClickDialogSignUser.bind(this)
    this.handleSignUserDialogClose = this.handleSignUserDialogClose.bind(this)
    this.handleGithubLink = this.handleGithubLink.bind(this)
  }

  componentDidMount () {
    this.props.isLogged()
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.location !== this.props.location) {
      this.props.isLogged()
    }
  }

  handleChange (event, checked) {
    this.setState({ auth: checked })
  }

  handleMenu (event) {
    this.setState({ anchorEl: event.currentTarget })
  }

  handleClose () {
    this.setState({ anchorEl: null })
  }

  handleClickDialogCreateTask () {
    this.setState({ createTaskDialog: true })
  }

  handleClickDialogCreateTaskClose () {
    this.setState({ createTaskDialog: false })
  }

  handleClickDialogSignUser (e) {
    this.setState(({ signUserDialog: true }))
  }

  handleGithubLink () {
    window.location.href = 'https://github.com/worknenjoy/gitpay'
  }

  handleProvider = (e, option) => {
    e.preventDefault()
    this.setState({provider: option})
  }

  onChange (e) {
    // Because we named the inputs to match their corresponding values in state, it's
    // super easy to update the state
    const task = this.state.task
    task[e.target.name].value = e.target.value
    task[e.target.name].error = false
    this.setState(task)
  }

  validURL (url) {
    return isGithubUrl(url) || isBitbucketUrl(url)
  }

  handleCreateTask (e) {
    const url = this.state.task.url.value
    if (this.validURL(url)) {
      this.props.createTask({
        url: this.state.task.url.value,
        provider: this.state.provider,
        userId: this.props.user ? this.props.user.id : null
      }, this.props.history)
      this.setState({ createTaskDialog: false })
    }
    else {
      this.setState({
        task: {
          url: {
            error: true
          }
        }
      })
    }
  }

  handleSignIn () {

  }

  handleSignUserDialogClose () {
    this.setState({ signUserDialog: false })
  }

  handleProfile () {
    window.location.assign('/#/profile')
  }

  handleSignOut () {
    this.props.history.replace({ pathname: '/' })
    this.props.signOut()
  }

  render () {
    const { completed, user } = this.props
    const isLoggedIn = this.props.logged
    const anchorEl = this.state.anchorEl
    const open = Boolean(anchorEl)

    const avatarPlaceholder = (
      <div className='avatar-placeholder'>
        <RoundShape color='#ccc' style={ { width: 40, height: 40, margin: 10 } } />
      </div>
    )

    return (
      <Bar>
        <Container>
          <LeftSide>
            <StyledButton href='/'>
              <HomeIcon color='primary' />
            </StyledButton>
          </LeftSide>

          <Logo src={ logo } />

          <RightSide>
            <StyledButton
              onClick={ this.handleClickDialogCreateTask }
              variant='raised'
              size='small'
              color='primary'
            >
              <LabelButton>Criar tarefa</LabelButton><PlusIcon />
            </StyledButton>

            { !isLoggedIn &&
              <div>
                <StyledButton
                  onClick={ this.handleClickDialogSignUser }
                  variant='raised'
                  size='small'
                  color='secondary'
                  paddingLeft
                >
                  <LabelButton>Entrar</LabelButton><UserIcon />
                </StyledButton>

                <Dialog
                  open={ this.state.signUserDialog }
                  onClose={ this.handleSignUserDialogClose }
                  aria-labelledby='form-dialog-title'
                >
                  <DialogTitle id='form-dialog-title'>Entre para a comunidade do Gitpay</DialogTitle>
                  <DialogContent>
                    <LoginButton referer={ this.props.location } size='medium' />
                  </DialogContent>
                </Dialog>
              </div>
            }

            <form onSubmit={ this.handleCreateTask } action='POST'>
              <Dialog
                open={ this.state.createTaskDialog }
                onClose={ this.handleClickDialogCreateTaskClose }
                aria-labelledby='form-dialog-title'
              >
                <DialogTitle id='form-dialog-title'>Inserir uma nova tarefa</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    <Typography type='subheading' gutterBottom>
                      Para inserir uma nova tarefa, cole a URL de um incidente do <strong>Github</strong> ou <strong>Bitbucket</strong>
                    </Typography>
                  </DialogContentText>
                  <FormControl style={ styles.formControl } error={ this.state.task.url.error }>
                    <TextField error={ this.state.task.url.error }
                      onChange={ this.onChange }
                      autoFocus
                      margin='dense'
                      id='url'
                      name='url'
                      label='URL da tarefa'
                      type='url'
                      fullWidth
                    />
                    <div style={{marginTop: 10, marginBottom: 10}}>
                      <Button
                        style={ { marginRight: 10 } }
                        color='primary'
                        variant={this.state.provider === 'github' ? 'raised' : 'contained'}
                        id='github'
                        onClick={(e) => this.handleProvider(e, 'github')}
                      >
                        <img width='16' src={ logoGithub } />
                        <span style={{marginLeft: 10}}>Github</span>
                      </Button>

                      <Button
                        color='primary'
                        variant={this.state.provider === 'bitbucket' ? 'raised' : 'contained'}
                        id='bitbucket'
                        onClick={(e) => this.handleProvider(e, 'bitbucket')}
                      >
                        <img width='16' src={ logoBitbucket } />
                        <span style={{marginLeft: 10}}>Bitbucket</span>
                      </Button>
                    </div>
                    { this.state.task.url.error &&
                    <FormHelperText error={ this.state.task.url.error }>A URL inserida não é válida</FormHelperText>
                    }
                  </FormControl>
                </DialogContent>
                <DialogActions>
                  <Button onClick={ this.handleClickDialogCreateTaskClose } color='primary'>
                    Cancelar
                  </Button>
                  <Button disabled={ !completed } onClick={ this.handleCreateTask } variant='raised' color='secondary' >
                    Inserir
                  </Button>
                </DialogActions>
              </Dialog>
            </form>

            <ReactPlaceholder showLoadingAnimation customPlaceholder={ avatarPlaceholder } ready={ completed }>
              <div>
                { (isLoggedIn && user.picture_url) &&
                  <StyledAvatar
                    alt={ user.username }
                    src={ user.picture_url }
                    onClick={ this.handleMenu }
                  />
                }

                { (isLoggedIn && !user.picture_url) &&
                  <StyledAvatar alt={ user.username } src='' onClick={ this.handleMenu }>
                    { nameInitials(user.username) }
                  </StyledAvatar>
                }

                { isLoggedIn &&
                  <Menu
                    id='menu-appbar'
                    anchorEl={ anchorEl }
                    anchorOrigin={ { vertical: 'top', horizontal: 'right' } }
                    transformOrigin={ { vertical: 'top', horizontal: 'right' } }
                    open={ open }
                    onClose={ this.handleClose }
                  >
                    <MenuItem onClick={ this.handleProfile }>Sua conta</MenuItem>
                    <MenuItem onClick={ this.handleSignOut }>Sair</MenuItem>
                  </Menu>
                }
              </div>
            </ReactPlaceholder>

            { isLoggedIn &&
              <OnlyDesktop>
                <Tooltip id='tooltip-github' title='Acessar nosso github' placement='bottom'>
                  <StyledAvatar
                    alt={ user.username }
                    src={ logoGithub }
                    onClick={ this.handleGithubLink }
                  />
                </Tooltip>
              </OnlyDesktop>
            }

          </RightSide>
        </Container>
      </Bar>
    )
  }
}

TopBar.propTypes = {
  isLogged: PropTypes.bool,
  location: PropTypes.string,
  history: PropTypes.string,
  user: PropTypes.object,
  createTask: PropTypes.object,
  signOut: PropTypes.func,
  logged: PropTypes.bool,
  completed: PropTypes.bool,
}

export default withRouter(withStyles(styles)(TopBar))

/* notification badge

<Badge badgeContent={4} color='secondary'>
  <NotificationIcon color='primary'/>
</Badge>
*/
