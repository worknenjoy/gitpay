import React, { useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import Tooltip from '@material-ui/core/Tooltip'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Chip from '@material-ui/core/Chip'
import Avatar from '@material-ui/core/Avatar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import slugify from '@material-ui/core'

import logoGithub from '../../images/github-logo.png'
import logoBitbucket from '../../images/bitbucket-logo.png'

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2),
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'flex-start'
  },
  rootCard: {
    maxWidth: 500,
    marginRight: 20,
  },
  item: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3)
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  }
}))

export default function OrganizationList ({ listOrganizations, organizations }) {
  const classes = useStyles()

  useEffect(() => {
    listOrganizations()
  }, [])

  return (
    <div className={ classes.root }>
      { organizations && organizations.data && organizations.data.map(o => {
        return (
          <div className={ classes.item }>
            { o.Projects && o.Projects.length > 0 &&
            <Card className={ classes.rootCard }>
              <CardHeader
                avatar={
                  <Avatar aria-label='recipe' className={ classes.avatar }>
                    { o.name[0] }
                  </Avatar>
                }
                action={
                  <IconButton aria-label='provider'>
                    <Tooltip id='tooltip-fab' title={ o.provider ? o.provider : 'See on repository' } placement='right'>
                      <a target='_blank' href={ o.provider === 'bitbucket' ? `https://bitbucket.com/${o.name}` : `https://github.com/${o.name}` } rel="noreferrer">
                        <img width='28' src={ o.provider === 'bitbucket' ? logoBitbucket : logoGithub }
                          style={ { borderRadius: '50%', padding: 3, backgroundColor: 'black' } }
                        />
                      </a>
                    </Tooltip>
                  </IconButton>
                }
                title={ <a
                  onClick={ (e) => {
                    e.preventDefault()
                    window.location.href = `/#/organizations/${o.id}/${slugify(o.name)}`
                    window.location.reload()
                  } }
                  href={ '' + o.id }>{ o.name }</a> }
                subheader={ o.User && `by ${o.User.name}` }
              />
              { o.description &&
              <CardContent>
                <Typography variant='body2' color='textSecondary' component='p'>
                  { o.description }
                </Typography>
              </CardContent>
              }
              <div style={ { paddingRight: 10 } }>
                <CardActions disableSpacing style={ { alignItems: 'center', paddingRight: 10, flexWrap: 'wrap' } }>
                  <Typography variant='body2' color='textSecondary' component='small' style={ { width: '100%', marginBottom: 10, marginLeft: 16 } }>
                    Projects:
                  </Typography>
                  { o.Projects && o.Projects.map(p =>
                    (<Chip style={ { marginLeft: 10, marginBottom: 10, flexWrap: 'wrap' } } size='medium' clickable onClick={ () => {
                      window.location.href = `/#/organizations/${o.id}/${slugify(o.name)}/projects/${p.id}`
                      window.location.reload()
                    } } label={ p.name }
                    />)
                  ) }
                </CardActions>
              </div>
            </Card> }
          </div>
        )
      }) }
    </div>
  )
}
