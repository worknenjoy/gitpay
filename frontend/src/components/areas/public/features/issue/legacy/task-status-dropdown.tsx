import React from 'react'
import { injectIntl } from 'react-intl'
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import Grow from '@mui/material/Grow'
import Paper from '@mui/material/Paper'
import Popper from '@mui/material/Popper'
import MenuItem from '@mui/material/MenuItem'
import MenuList from '@mui/material/MenuList'
import Constants from '../../../../../../consts'

const options = ['open', 'in_progress', 'closed']

export function TaskStatusDropdown({ onSelect, status, intl }) {
  const [open, setOpen] = React.useState(false)
  const anchorRef = React.useRef<HTMLDivElement>(null)
  const [selectedOption, setSelectedOption] = React.useState(status)

  const handleClick = () => {
    console.info(`You clicked ${selectedOption}`)
  }

  const handleMenuItemClick = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    name: string
  ) => {
    setSelectedOption(name)
    setOpen(false)
    onSelect(name)
  }

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen)
  }

  const handleClose = (event: Event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
      return
    }

    setOpen(false)
  }

  const getColorByStatus = (status) => {
    switch (status) {
      case 'open':
        return 'success'
      case 'in_progress':
        return 'warning'
      case 'closed':
        return 'error'
      default:
        return 'inherit'
    }
  }

  return (
    <React.Fragment>
      <ButtonGroup
        variant="contained"
        disableElevation
        ref={anchorRef}
        aria-label="split button"
        size="small"
        color="inherit"
      >
        <Button onClick={handleClick} size="small" color={getColorByStatus(selectedOption)}>
          {intl.formatMessage(Constants.STATUSES[selectedOption])}
        </Button>
        <Button
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
        sx={{
          zIndex: 1
        }}
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
            <Paper elevation={0}>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="split-button-menu" autoFocusItem>
                  {options.map((option) => (
                    <MenuItem
                      key={option}
                      selected={option === selectedOption}
                      onClick={(event) => handleMenuItemClick(event, option)}
                    >
                      {intl.formatMessage(Constants.STATUSES[option])}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </React.Fragment>
  )
}

export default injectIntl(TaskStatusDropdown)
