import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import {
  Chip,
  Typography,
} from '@material-ui/core'

import PropTypes from 'prop-types'

const data = [
  { label: 'React.js', url: 'https://reactjs.org/' },
  { label: 'Material-ui', url: 'https://material-ui.com/' },
  { label: 'Node.js', url: 'https://nodejs.org' },
  { label: 'Postgres', url: 'https://www.postgresql.org/' },
  { label: 'Heroku', url: 'http://heroku.com/' },
  { label: 'Github', url: 'https://github.com' }
]

export const Technology = styled(Chip)`
  && {
    margin: 10px;
    font-weight: bold;
  }
`

export const Stack = styled.div`
  margin-top: 5px;
`

export const Content = styled.div`
   margin-top: 20px;
   padding-bottom: 10px;
   color: white;
   text-align: center;
`

const handleClick = url => event => {
  window.location.href = url
}

const OurStack = ({ technologies }) => (
  <Content>
    <Typography variant='body1' color='inherit' gutterBottom>
      <FormattedMessage id='info.stack.subheading' defaultMessage='Our stack' />
      <Stack>
        { technologies.map((technology, index) =>
          (<Technology
            onClick={ handleClick(technology.url) }
            key={ index }
            label={ technology.label }
          />)
        )
        }
      </Stack>
    </Typography>
  </Content>
)

OurStack.propTypes = {
  technologies: PropTypes.array
}

OurStack.defaultProps = {
  technologies: data
}

export default OurStack
