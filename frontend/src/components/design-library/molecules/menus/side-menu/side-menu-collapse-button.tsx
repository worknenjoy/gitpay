import React from 'react'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { IconButton } from '@mui/material'

const SideMenuCollapseButton = ({ setCollapsed, collapsed }) => {
  return (
    <IconButton
      onClick={setCollapsed}
      style={{
        color: 'white',
        width: 20,
        height: 20,
        position: 'absolute',
        right: -28,
        top: -56,
        fontWeight: 'bold',
        fontSize: '15px',
        padding: '3px',
        zIndex: 5,
        backgroundColor: 'white',
        borderRadius: '50%',
        boxShadow: '0 0 4px rgba(0,0,0,0.3)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      {!collapsed ? <ChevronLeftIcon color="primary" /> : <ChevronRightIcon color="primary" />}
    </IconButton>
  )
}

export default SideMenuCollapseButton
