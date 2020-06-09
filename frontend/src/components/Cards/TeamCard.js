import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { FormattedMessage } from 'react-intl'
import Card from '@material-ui/core/Card'
import CardActionArea from '@material-ui/core/CardActionArea'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import LinkedInIcon from '@material-ui/icons/LinkedIn'

const useStyles = makeStyles(theme => ({
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    justifyContent: 'center'
  },
  root: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    }
  },
  card: {
    maxWidth: 400,
    margin: 40
  },
  media: {
    height: 220,
  },
}))

export default function TeamCard (props) {
  const { data } = props
  const classes = useStyles()

  return (
    <div className={ classes.wrapper }>
      <Typography variant='h5' gutterBottom>
        <FormattedMessage
          id='team.title'
          defaultMessage='Team'
        />
      </Typography>
      <div className={ classes.root }>
        { data && data.map(member => {
          return (
            <Card className={ classes.card }>
              <CardActionArea>
                <CardMedia
                  className={ classes.media }
                  image={ member.image }
                  title={ member.name }
                />
                <CardContent>
                  <Typography gutterBottom variant='h5' component='h2'>
                    { member.name }
                  </Typography>
                  <Typography variant='body2' color='textSecondary' component='p'>
                    { member.description }
                  </Typography>
                </CardContent>
              </CardActionArea>
              <CardActions style={ { display: 'flex', flexDirection: 'row', justifyContent: 'center' } }>
                { member.linkedinUrl &&
                  <Button target='_blank' href={ member.linkedinUrl } size='small' color='secondary' variant='outlined'>
                    <span>Linkedin</span>
                    <LinkedInIcon />
                  </Button>
                }
                { member.githubUrl &&
                  <Button target='_blank' href={ member.githubUrl } size='small' color='primary'>
                    Github
                  </Button>
                }
              </CardActions>
            </Card>
          )
        })
        }
      </div>
    </div>
  )
}
