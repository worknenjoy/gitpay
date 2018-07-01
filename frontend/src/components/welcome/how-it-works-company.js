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

import { InfoList, MainTitle } from './components/CommonStyles'

class HowItWorksCompany extends Component {
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
                Para empresas
              </Typography>
            </Toolbar>
            <div classeName={ classes.spacedTop }>
              <MainTitle>
                <Typography variant='title' className={ classes.appBarHeader } gutterBottom>
                  Como funciona
                </Typography>
              </MainTitle>
            </div>
            <InfoList>
              <List>
                <ListItem className={ classes.listIconTop }>
                  <ListItemIcon>
                    <Avatar>
                      <AppsIcon />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary='A empresa precisa de uma demanda resolvida para o seu projeto'
                    secondary='Avaliamos sua demanda e a realidade da empresa para que seu projeto tenha uma estrutura mínima de desenvolvimento para as diferentes competências'
                  />
                </ListItem>
                <ListItem className={ classes.listIconTop }>
                  <ListItemIcon>
                    <Avatar>
                      <WorkIcon />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary='Empresas podem nascer, idéias podem entrar em prática'
                    secondary='Oferecemos serviços para que sua idéia saia do papel de forma colaborativa entre as diferentes competências como design, conteúdo e desenvolvimento, e você paga apenas por cada trabalho concluído de forma iterativa. Cada demanda é integrada e pronta para ser usada pelos clientes'
                  />
                </ListItem>
                <ListItem className={ classes.listIconTop }>
                  <ListItemIcon>
                    <Avatar>
                      <AccountBalanceWalletIcon />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary='Sua tarefa é enviada para os freelancers'
                    secondary='A sua demanda é traduzida e dividida entre as diferentes competência para então ser atribuída aos freelancers que irão realizar a entrega de acordo com prazo e valores que podem ser definidos usando diferentes processos adaptados à realidade do seu projeto e tamanho da empresa'
                  />
                </ListItem>
              </List>
            </InfoList>
          </AppBar>
        </Dialog>
      </ListItem>
    )
  }
}

HowItWorksCompany.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default HowItWorksCompany
