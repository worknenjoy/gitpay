import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import TopBar from '../../../design-library/organisms/topbar/topbar'
import Bottom from '../../../design-library/organisms/bottom-bar/bottom'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    marginTop: 0
  },
}))

const PublicBase = ({ children }) => {
  const classes = useStyles()

  return (
    <div className={ classes.root }>
      <TopBar ref='intro' hide />
      { children }
      <Bottom
        info={ () => {} }
        tasks={10}
        bounties={10}
        users={10}
      />
    </div>
  )
}

export default PublicBase
