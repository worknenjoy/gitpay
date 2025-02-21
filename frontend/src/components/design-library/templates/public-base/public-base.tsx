import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import TopBar from '../../../design-library/organisms/topbar/topbar'
import Bottom from '../../../design-library/organisms/bottom-bar/bottom'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    marginTop: 0
  },
}))

type PublicBaseProps = {
  children: React.ReactNode
  loggedIn?: any,
  bottomBarProps?: any,
  accountMenuProps?: any
}

const PublicBase = ({ children, loggedIn, bottomBarProps, accountMenuProps }:PublicBaseProps) => {
  const classes = useStyles()

  return (
    <div className={ classes.root }>
      <TopBar
        loggedIn={ loggedIn }
        accountMenuProps={ accountMenuProps }
      />
      { children }
      <Bottom
        { ...bottomBarProps }
      />
    </div>
  )
}

export default PublicBase
