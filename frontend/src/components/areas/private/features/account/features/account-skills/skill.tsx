import React from "react";
import classNames from "classnames";
import { withStyles, Grid, Typography, Checkbox, Avatar } from "@mui/material";
import { SkillIcon } from "./skill-icon"

const styles = theme => ({
  skillIcon: {
    borderRadius: 0,
    backgroundColor: 'transparent'
  },
  greyed: {
    filter: 'grayscale(0.8)'
  }
})


function Skill({ classes, title, onClick, isSelected }) {
  return (
    <Grid container direction="row" alignItems="center" xs={6}>
      <Grid xs={2}>
        <Avatar className={classNames(classes.skillIcon, !isSelected && classes.greyed)}>
          <SkillIcon name={title} />
        </Avatar>
      </Grid>
      <Grid xs={6}>
        <Typography variant="body1" color="primary">
          {title}
        </Typography>
      </Grid>
      <Grid xs={4} alignItems="flex-end">
        <Checkbox onClick={onClick} checked={isSelected ? true : false} />
      </Grid>
    </Grid>
  );
}

export default withStyles(styles)(Skill);
