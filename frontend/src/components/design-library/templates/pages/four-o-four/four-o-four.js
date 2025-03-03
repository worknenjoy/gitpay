import React from 'react'
import { Block } from '@material-ui/icons'
import { Link } from '@material-ui/core'
import { FormattedMessage } from 'react-intl'

export default () => {
  return (
    <div style={ {
      margin: 'auto',
      width: '80%',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'monospace',
      textAlign: 'center'
    } } >
      <div style={ {
        display: 'flex',
        height: '40vh',
        justifyContent: 'center',
        alignItems: 'center'
      } }>
        <Block style={ {
          fontSize: 200,
          color: 'rgb(200,0,50)'
        } } />
        <p style={ {
          fontSize: 40,
        } }>
          <FormattedMessage id='page.404.message' defaultMessage='404 Page Not Found' />
        </p>
      </div>
      <p style={ { fontSize: 25 } }>
        <FormattedMessage id='page.404.goto' defaultMessage='You can go to Home Page' />
      </p>
      <div style={ {
        fontSize: 20,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      } }>
        <p>
          <Link href='/'>
            <FormattedMessage id='page.404.link.home' defaultMessage='Home' />
          </Link>
        </p>
      </div>
    </div>
  )
}
