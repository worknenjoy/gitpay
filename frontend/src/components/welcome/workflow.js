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

class Workflow extends Component {
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
        <ListItemText primary='Fluxo de trabalho' />
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
              <MainTitle>
                <Typography variant='title' className={ classes.appBarHeader } gutterBottom>
                  Fluxo de trabalho
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
                    primary='Para todos os envolvidos'
                    secondary='Clientes, líderes técnicos, designers e gestores, todos podem acompanhar o status e progresso usando ferramentas já conhecidas para gestão de projetos ágeis à distância'
                  />
                </ListItem>
                <ListItem className={ classes.listIconTop }>
                  <ListItemIcon>
                    <Avatar>
                      <WorkIcon />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary='Para todos os níveis'
                    secondary='Iniciantes podem aprender na prática como contribuir com empresas reais para encarar um mercado de trabalho competitivo, e freelancers com experiência podem participar de revisões, liderar projetos remotos e atuar em áreas em que ele tenha mais familiaridade e experiência e desenvolver melhorias para o projeto'
                  />
                </ListItem>
                <ListItem className={ classes.listIconTop }>
                  <ListItemIcon>
                    <Avatar>
                      <AccountBalanceWalletIcon />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary='Aprenda na prática ou ganhe trabalhando com o que você domina'
                    secondary='Trabalhe em diferentes projetos e aprenda a criar soluções em times distribuídos por todo o mundo, usando as ferramentas que você já usa e propondo soluções para problemas que você conhece. Você também pode encarar novos desafios sem burocracia!'
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

Workflow.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default Workflow
