import React, { useEffect } from 'react'
import { styled } from '@mui/material/styles'
import Card from '@mui/material/Card'
import Tooltip from '@mui/material/Tooltip'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Chip from '@mui/material/Chip'
import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import slugify from '@sindresorhus/slugify'

import logoGithub from 'images/github-logo.png'
import logoBitbucket from 'images/bitbucket-logo.png'

const Root = styled('div')(({ theme }) => ({
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(2),
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'flex-start'
}))

const RootCard = styled(Card)(({ theme }) => ({
  maxWidth: 500,
  marginRight: 20
}))

const Item = styled('div')(({ theme }) => ({
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(3)
}))

export default function OrganizationList ({ listOrganizations, organizations }) {

  useEffect(() => {
    listOrganizations()
  }, [])

  return (
    <Root>
      { organizations && organizations.data && organizations.data.map(o => {
        return (
          <Item>
            { o.Projects && o.Projects.length > 0 &&
            <RootCard>
              <CardHeader
                avatar={
                  <Avatar aria-label='recipe'>
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
            </RootCard> }
          </Item>
        )
      }) }
    </Root>
  )
}
