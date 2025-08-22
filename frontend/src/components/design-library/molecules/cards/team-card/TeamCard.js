import React from 'react'
import { styled } from '@mui/material/styles'
import { FormattedMessage } from 'react-intl'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import GitHubIcon from '@mui/icons-material/GitHub'

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
    flexFlow: 'column wrap',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column'
    }
  },
  card: {
    maxWidth: 400,
    minWidth: 350,
    [theme.breakpoints.down('sm')]: {
      minWidth: 0
    },
    margin: 40
  },
  media: {
    height: 220
  }
}))

export default function TeamCard (props) {
  const { data } = props
  const classes = useStyles()

  return (
    <div className={ classes.wrapper }>
      <Typography variant="h5" gutterBottom>
        <FormattedMessage
          id="team.title"
          defaultMessage="Team"
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
                  <Typography gutterBottom variant="h5" component="h2">
                    { member.name }
                  </Typography>
                  <Typography variant="body2" color="textSecondary" style={ { whiteSpace: 'initial' } }>
                    { member.description }
                  </Typography>
                </CardContent>
              </CardActionArea>
              <CardActions style={ { display: 'flex', flexDirection: 'row', justifyContent: 'center' } }>
                { member.linkedinUrl &&
                  <Button target="_blank" href={ member.linkedinUrl } size="small" color="secondary" variant="outlined">
                    <span>Linkedin</span>
                    <LinkedInIcon />
                  </Button>
                }
                { member.githubUrl &&
                  <Button target="_blank" href={ member.githubUrl } size="small" variant="outlined">
                    <span>Github&thinsp;</span>
                    <GitHubIcon />
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
