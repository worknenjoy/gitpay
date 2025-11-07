import React, { useState } from 'react'
import TeamCard from 'design-library/molecules/cards/team-card/team-card'
import { Grid } from '@mui/material'
import { Page } from '../../../../../styleguide/components/Page'
import { Section } from '../home-public-page/CommonStyles'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import teamImage from 'images/core-team-page-asset.png'
import imgAlexandre from 'images/teams/headhunter-team-member1.png'
import imgWharley from '../../../../../images/teams/wharley-team-member.jpg'
import imgMayna from '../../../../../images/teams/core-team-mayna.jpg'
import imgRafael from '../../../../../images/teams/profile_rq.jpg'
import { FormattedMessage } from 'react-intl'
import { CoreTeamForm, UnderlineTextField } from './team-public-page.styles'
import HeroTitle from 'design-library/atoms/typography/hero-title/hero-title'

function checkEmail(emailAddress) {
  let sQtext = '[^\\x0d\\x22\\x5c\\x80-\\xff]'
  let sDtext = '[^\\x0d\\x5b-\\x5d\\x80-\\xff]'
  let sAtom = '[^\\x00-\\x20\\x22\\x28\\x29\\x2c\\x2e\\x3a-\\x3c\\x3e\\x40\\x5b-\\x5d\\x7f-\\xff]+'
  let sQuotedPair = '\\x5c[\\x00-\\x7f]'
  let sDomainLiteral = '\\x5b(' + sDtext + '|' + sQuotedPair + ')*\\x5d'
  let sQuotedString = '\\x22(' + sQtext + '|' + sQuotedPair + ')*\\x22'
  let sDomainRef = sAtom
  let sSubDomain = '(' + sDomainRef + '|' + sDomainLiteral + ')'
  let sWord = '(' + sAtom + '|' + sQuotedString + ')'
  let sDomain = sSubDomain + '(\\x2e' + sSubDomain + ')*'
  let sLocalPart = sWord + '(\\x2e' + sWord + ')*'
  let sAddrSpec = sLocalPart + '\\x40' + sDomain // complete RFC822 email address spec
  let sValidEmail = '^' + sAddrSpec + '$' // as whole string

  let reValidEmail = new RegExp(sValidEmail)

  return reValidEmail.test(emailAddress)
}

const currentTeam = [
  {
    name: 'Alexandre Magno',
    description: 'Founder of Gitpay, and senior software engineer for 15+ years, Alexandre is an active open source maintainer, author of Mobile First Boostrap and he help the development community with your blog alexandremagno.net.',
    image: imgAlexandre,
    linkedinUrl: 'https://www.linkedin.com/in/alexandremagnoteleszimerer/',
    githubUrl: 'https://github.com/alexanmtz'
  }
]

const pastContributors = [
  {
    name: 'Wharley Ornelas',
    description: 'Fullstack developer, with 15+ development experience. First developer to contribute and he helped with the core, and a brazilian developer evangelist',
    image: imgWharley,
    linkedinUrl: 'https://in.linkedin.com/in/wharley-ornelas-da-rocha-65420932',
    githubUrl: 'http://github.com/wharley'
  },
  {
    name: 'Mayna Thais',
    description: 'Project leader with 9+ years of experience. She has worked with software projects and IT infrastructure for many companies. Graduated in Information Systems, MBA in Project Management and Scrum Master certified.',
    image: imgMayna,
    linkedinUrl: 'https://br.linkedin.com/in/mayna-thais',
    githubUrl: 'https://github.com/mthais'
  },
  {
    name: 'Rafael Quintanilha',
    description: 'Software Developer Intern at Gitpay. Graduated in IT Management and with a master\'s in e-business, Rafael has experience working as a digital project manager and now embraces a new career path as a web developer.',
    image: imgRafael,
    linkedinUrl: 'https://www.linkedin.com/in/rafael-quintanilha/',
    githubUrl: 'https://github.com/RafaelQuintanilha18'
  }
]

type TeamProps = {
  joinTeamAPICall: (email: string) => void
}

export default function Team({
  joinTeamAPICall
}: TeamProps) {
  const [formData, setFormData] = useState<{ email: string }>({ email: '' })
  const [formErrors, setFormErrors] = useState<{ email?: boolean }>({})

  const onChange = (event) => {
    const name = event.nativeEvent.target.name
    const value = event.target.value
    setFormData({ ...formData, [name]: value })
  }

  const onSubmit = (event) => {
    event.preventDefault()
    if (Object.keys(formErrors).length === 0) {
      joinTeamAPICall(formData.email)
    }
  }

  const onBlur = (event) => {
    !checkEmail(formData.email) ? setFormErrors({ ...formErrors, email: true }) : setFormErrors({})
  }

  return (
    <Page>
      <HeroTitle level="h5">
        <FormattedMessage id="team.page.title" defaultMessage="Meet the Gitpay Team" />
      </HeroTitle>
      <Section>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }} justifyContent="center">
            <TeamCard
              title={<FormattedMessage id="team.currentTeam" defaultMessage="Our Current maintainer" />}
              data={currentTeam}
            />
          </Grid>
          <Grid size={{ xs: 12 }} justifyContent="center">
            <TeamCard
              title={<FormattedMessage id="team.pastContributors" defaultMessage="Our Past Contributors" />}
              data={pastContributors}
            />
          </Grid>
        </Grid>
      </Section>
      <div style={{ backgroundColor: 'black', padding: '20px' }}>
        <Section>
          <Grid container spacing={3} alignItems={'center'} justifyContent={'flex-start'} >
            <Grid size={{ lg: 8, md: 8, sm: 6 }}>
              <img src={teamImage} alt="assets" />
            </Grid>
            <Grid size={{ lg: 4, md: 4, sm: 6 }}>
              <form onChange={onChange} onSubmit={onSubmit} onBlur={onBlur}>
                <CoreTeamForm container>
                  <Grid size={{ xs: 12 }} >
                    <Typography gutterBottom >
                      <FormattedMessage id="team.joinCoreTeam" defaultMessage="Join our Core Team" />
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12 }} style={{ color: 'silver' }} >
                    <Typography gutterBottom >
                      <FormattedMessage id="team.joinCoreTeamDescription" defaultMessage="Leave your e-mail if you are interested in joining our Core Team" />
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <UnderlineTextField
                      required
                      value={formData.email}
                      error={formErrors.email}
                      id="email"
                      fullWidth
                      label="Email Address"
                      name="email"
                      color="primary"
                      autoComplete="email"
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Button color="primary" fullWidth variant="contained" type="submit">
                      <Typography gutterBottom >
                        <FormattedMessage id="team.joinButton" defaultMessage="Join Now" />
                      </Typography>
                    </Button>
                  </Grid>
                </CoreTeamForm>
              </form>
            </Grid>
          </Grid>
        </Section>
      </div>
    </Page>
  )
}