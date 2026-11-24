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
import Menu from '@mui/material/Menu'

const options = ['', 'easy', 'medium', 'hard']

export const optionLabels = {
  '': 'Choose level',
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard'
}

type TaskLevelSplitButtonProps = {
  id: number
  level?: string | null
  updateTask: (data: { id: number; level: string }) => any
  /** compact: a small text button with a menu, for tight spots like a details row. */
  variant?: 'default' | 'compact'
}

export default function TaskLevelSplitButton({
  id,
  level,
  updateTask,
  variant = 'default'
}: TaskLevelSplitButtonProps) {
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

  if (variant === 'compact') {
    return (
      <>
        <Button
          ref={anchorRef}
          size="small"
          color="primary"
          onClick={handleToggle}
          endIcon={<ArrowDropDownIcon />}
          aria-haspopup="menu"
          aria-expanded={open ? 'true' : undefined}
          sx={{
            minWidth: 0,
            p: '0 4px',
            mr: '-4px',
            fontSize: 14,
            fontWeight: 500,
            textTransform: 'none',
            lineHeight: 1.5,
            '& .MuiButton-endIcon': { ml: 0 }
          }}
        >
          {optionLabels[selectedLevel] || optionLabels['']}
        </Button>
        <Menu
          anchorEl={anchorRef.current}
          open={open}
          onClose={() => setOpen(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          {options.map((option, index) => (
            <MenuItem
              key={index}
              dense
              selected={index === selectedIndex}
              onClick={(event) => handleMenuItemClick(event, index, option)}
            >
              {optionLabels[option]}
            </MenuItem>
          ))}
        </Menu>
      </>
    )
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
