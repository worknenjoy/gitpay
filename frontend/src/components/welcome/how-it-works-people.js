import React, { Component } from 'react'
import PropTypes from 'prop-types'
import List, { ListItem, ListItemText, ListItemIcon } from 'material-ui/List'
import Dialog from 'material-ui/Dialog'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import IconButton from 'material-ui/IconButton'
import CloseIcon from 'material-ui-icons/Close'
import Typography from 'material-ui/Typography'
import Avatar from 'material-ui/Avatar'
import AppsIcon from 'material-ui-icons/Apps'
import WorkIcon from 'material-ui-icons/Work'
import AccountBalanceWalletIcon from 'material-ui-icons/AccountBalanceWallet'
import Transition from '../transition'

class HowItWorksPeople extends Component {
  constructor (props) {
    super(props)
    this.state = {
      open: false
    }
    this.handleClickOpen = this.handleClickOpen.bind(this)
    this.handleClose = this.handleClose.bind(this)
  }

  componentDidMount () {

  }

  handleClickOpen () {
    this.setState({ open: true })
  }

  handleClose () {
    this.setState({ open: false })
  }

  render () {
    const { classes } = this.props

    return (
      <ListItem button onClick={ this.handleClickOpen } component='a'>
        <ListItemText primary='Como funciona' />
        <Dialog
          fullScreen
          open={ this.state.open }
          onClose={ this.handleClose }
          transition={ Transition }
        >
          <AppBar className={ classes.appBar }>
            <Toolbar>
              <IconButton color='inherits' onClick={ this.handleClose } aria-label='Close'>
                <CloseIcon />
              </IconButton>
              <Typography variant='title' className={ classes.appBarHeader }>
                Para freelancers
              </Typography>
            </Toolbar>
            <div classeName={ classes.spacedTop }>
              <div className={ classes.divider }>
                <Typography variant='title' className={ classes.appBarHeader } gutterBottom>
                  Como funciona
                </Typography>
              </div>
            </div>
            <div className={ classes.infoList }>
              <List>
                <ListItem className={ classes.listIconTop }>
                  <ListItemIcon>
                    <Avatar>
                      <AppsIcon />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary='Se inscreva no site e saiba quando novas tarefas surgirem'
                    secondary='Clientes enviam propostas para diferentes demandas do projeto e procuram freelancers com diferentes conhecimentos'
                  />
                </ListItem>
                <ListItem className={ classes.listIconTop }>
                  <ListItemIcon>
                    <Avatar>
                      <WorkIcon />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary='Você é atribuído a tarefa e recebe as instruções'
                    secondary='É dado o acesso ao repositório do projeto com o que precisa para começar e pode discutir sobre as soluções'
                  />
                </ListItem>
                <ListItem className={ classes.listIconTop }>
                  <ListItemIcon>
                    <Avatar>
                      <AccountBalanceWalletIcon />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary=' A sua mudança é avaliada, o projeto é integrado e você recebe o pagamento'
                    secondary=' Sua mudança é enviada e avaliada em um ambiente de testes e mudanças podem ser discutidas e revisadas com os envolvidos no projeto. Assim que a mudança é integrada você recebe o pagamento'
                  />
                </ListItem>
              </List>
            </div>
          </AppBar>
        </Dialog>
      </ListItem>
    )
  }
}

HowItWorksPeople.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default HowItWorksPeople
