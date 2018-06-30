import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import Paper from 'material-ui/Paper'
import Typography from 'material-ui/Typography'
import Button from 'material-ui/Button'
import { CardActions, CardContent } from 'material-ui/Card'
import { withStyles } from 'material-ui/styles'

import { Card, CardList, CardMedia } from './ProfileStyles'

const taskIcon = require('../../images/task-icon.png')
const paymentIcon = require('../../images/payment-icon.png')
const toolsIcon = require('../../images/tools-icon.png')

const styles = theme => ({
  paper: {
    paddingLeft: 20,
    marginLeft: 20
  },
  parentCard: {
    marginTop: 40,
    marginLeft: 40,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  card: {
    maxWidth: 280,
    marginRight: 10,
    textAlign: 'center'
  },
  cardActions: {
    display: 'flex',
    justifyContent: 'center'
  },
  media: {
    width: 128,
    height: 128,
    marginLeft: 64,
    marginTop: 20
  }
})

class ProfileOptions extends Component {
  render () {
    const { classes } = this.props

    return (
      <div>
        <Paper className={ classes.paper } elevation={ 0 }>
          <Typography variant='headline' component='h3'>
            Bem vindo ao Gitpay!
          </Typography>
          <Typography component='p'>
            Saiba quais são os seus primeiros passos para começar
          </Typography>
        </Paper>

        <CardList>
          <Card>
            <CardMedia
              image={ taskIcon }
              title='Contemplative Reptile'
            />
            <CardContent>
              <Typography variant='headline' component='h2'>
                Tarefas
              </Typography>
              <Typography component='p'>
                Veja as tarefas que estão disponíveis para você e comece!
              </Typography>
            </CardContent>
            <CardActions className={ classes.cardActions }>
              <Button size='small' color='primary'>
                <Link to={ '/profile/tasks' }>Ver tarefas</Link>
              </Button>
            </CardActions>
          </Card>

          <Card>
            <CardMedia
              image={ paymentIcon }
              title='Contemplative Reptile'
            />
            <CardContent>
              <Typography variant='headline' component='h2'>
                Pagamento
              </Typography>
              <Typography component='p'>
                Preencha os dados de pagamento para você receber pelas tarefas
                integradas
              </Typography>
            </CardContent>
            <CardActions className={ classes.cardActions }>
              <Button size='small' color='primary'>
                <Link to={ '/profile/payment-options' }>
                  Configurar pagamento
                </Link>
              </Button>
            </CardActions>
          </Card>

          <Card>
            <CardMedia
              image={ toolsIcon }
              title='Contemplative Reptile'
            />
            <CardContent>
              <Typography variant='headline' component='h2'>
                Preferências
              </Typography>
              <Typography component='p'>
                Configure sua conta para ficar de acordo com suas preferências
              </Typography>
            </CardContent>
            <CardActions className={ classes.cardActions }>
              <Button size='small' color='primary'>
                <Link to='/profile/preferences'>Configurar preferências</Link>
              </Button>
            </CardActions>
          </Card>
        </CardList>
      </div>
    )
  }
}

ProfileOptions.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(ProfileOptions)
