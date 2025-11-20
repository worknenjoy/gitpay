import React, { useEffect } from 'react'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import Grow from '@mui/material/Grow'
import Paper from '@mui/material/Paper'
import Popper from '@mui/material/Popper'
import MenuItem from '@mui/material/MenuItem'
import MenuList from '@mui/material/MenuList'

const options = ['', 'easy', 'medium', 'hard']

const optionLabels = {
  '': 'Choose level',
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard'
}

export default function TaskLevelSplitButton({ id, level, updateTask }) {
  const [open, setOpen] = React.useState(false)
  const anchorRef = React.useRef(null)
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const [selectedLevel, setSelectedLevel] = React.useState('')

  useEffect(() => {
    switch (level) {
      case '':
        setSelectedIndex(0)
        setSelectedLevel('')
        break
      case 'easy':
        setSelectedIndex(1)
        setSelectedLevel('easy')
        break
      case 'medium':
        setSelectedIndex(2)
        setSelectedLevel('medium')
        break
      case 'hard':
        setSelectedIndex(3)
        setSelectedLevel('hard')
        break
      default:
        break
    }
  }, [])

  const handleClick = () => {}

  const handleMenuItemClick = async (event, index, currentLevel) => {
    setSelectedIndex(index)
    setSelectedLevel(currentLevel)
    setOpen(false)
    await updateTask({ id: id, level: currentLevel })
  }

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen)
  }

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return
    }

    setOpen(false)
  }

  return (
    <Grid container direction="column" alignItems="center">
      <Grid size={{ xs: 12 }}>
        <ButtonGroup variant="outlined" color="secondary" ref={anchorRef} aria-label="split button">
          <Button onClick={handleClick}>
            {selectedLevel || optionLabels[options[selectedIndex]]}
          </Button>
          <Button
            color="secondary"
            size="small"
            aria-controls={open ? 'split-button-menu' : undefined}
            aria-expanded={open ? 'true' : undefined}
            aria-label="select merge strategy"
            aria-haspopup="menu"
            onClick={handleToggle}
          >
            <ArrowDropDownIcon />
          </Button>
        </ButtonGroup>
        <Popper
          style={{ zIndex: 9999 }}
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          transition
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom'
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList id="split-button-menu">
                    {options.map((option, index) => (
                      <MenuItem
                        key={index}
                        selected={index === selectedIndex}
                        onClick={(event) => handleMenuItemClick(event, index, option)}
                      >
                        {optionLabels[option]}
                      </MenuItem>
                    ))}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </Grid>
    </Grid>
  )
}
