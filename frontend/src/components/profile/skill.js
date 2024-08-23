import React from "react";
import { withRouter } from "react-router-dom";
import { injectIntl } from "react-intl";
import PropTypes from "prop-types";
import classNames from "classnames";

import { Grid, Typography, Checkbox, Avatar } from "@material-ui/core";
import FolderIcon from "@material-ui/icons/Folder";

function Skill({ classes, title, onClick, isSelected }) {
  return (
    <Grid container direction="row" alignItems="center" xs={6}>
      <Grid item xs={2}>
        <Avatar className={classNames(classes.avatar, classes.bigAvatar)}>
          <FolderIcon />
        </Avatar>
      </Grid>
      <Grid item xs={6}>
        <Typography variant="body1" color="default">
          {title}
        </Typography>
      </Grid>
      <Grid item xs={4} alignItems="flex-end">
        <Checkbox onClick={onClick} checked={isSelected ? "checked" : ""} />
      </Grid>
    </Grid>
  );
}

Skill.propTypes = {
  classes: PropTypes.object.isRequired,
  preferences: PropTypes.string,
  language: PropTypes.string,
  title: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  isSelected: PropTypes.bool,
};

export default injectIntl(withRouter(Skill));
