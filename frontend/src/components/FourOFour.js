import React from 'react'
import { Block } from '@material-ui/icons'
import { Link } from '@material-ui/core'

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
         404 Page not Found
        </p>
      </div>
      <p style={ { fontSize: 25 } }>You can go to Home page</p>
      <div style={ {
        fontSize: 20,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      } }>
        <p><Link href='/'>Home</Link></p>
      </div>
    </div>
  )
}
