import React from 'react'
import CardActionArea from '@mui/material/CardActionArea'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import GitHubIcon from '@mui/icons-material/GitHub'
import Button from '@mui/material/Button'
import { Wrapper, Root, StyledCard, Media } from './team-card.styles'

type TeamCardProps = {
  title?: React.ReactNode | string
  data: Array<{
    name: string
    description: string
    image: string
    linkedinUrl?: string
    githubUrl?: string
  }>
}

export default function TeamCard({ title, data }: TeamCardProps) {
  return (
    <Wrapper>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Root>
        {data &&
          data.map((member) => {
            return (
              <StyledCard>
                <CardActionArea>
                  <Media image={member.image} title={member.name} />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                      {member.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      style={{ whiteSpace: 'initial' }}
                    >
                      {member.description}
                    </Typography>
                  </CardContent>
                </CardActionArea>
                <CardActions
                  style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}
                >
                  {member.linkedinUrl && (
                    <Button
                      target="_blank"
                      href={member.linkedinUrl}
                      size="small"
                      color="secondary"
                      variant="outlined"
                    >
                      <span>Linkedin</span>
                      <LinkedInIcon />
                    </Button>
                  )}
                  {member.githubUrl && (
                    <Button target="_blank" href={member.githubUrl} size="small" variant="outlined">
                      <span>Github&thinsp;</span>
                      <GitHubIcon />
                    </Button>
                  )}
                </CardActions>
              </StyledCard>
            )
          })}
      </Root>
    </Wrapper>
  )
}
