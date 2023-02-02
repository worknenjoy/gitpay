import React from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import { FormattedMessage } from 'react-intl';

const options = ['Issue', 'Project', 'Organization'];

export default function ImportIssueButton({
  onAddIssueClick
}) {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const handleClick = (e) => {
    e.preventDefault();
    onAddIssueClick()
  };

  const handleMenuItemClick = (event, index) => {
    event.preventDefault();
    setSelectedIndex(index);
    setOpen(false);
    onAddIssueClick()
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  return (
    <Grid container direction="column" alignItems="center">
      <Grid item xs={12}>
        <ButtonGroup variant="contained" color="primary" ref={anchorRef} aria-label="split button">
          <Button onClick={handleClick}>
            <FormattedMessage
              id='home.hero.headline.button.secondary'
              defaultMessage='Import issue'
            />
          </Button>
        </ButtonGroup>
      </Grid>
    </Grid>
  );
}
