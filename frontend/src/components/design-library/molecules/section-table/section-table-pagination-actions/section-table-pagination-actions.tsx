import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles'
import { useIntl } from 'react-intl';

import {
  IconButton
} from '@material-ui/core';
import {
  FirstPage as FirstPageIcon,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  LastPage as LastPageIcon
} from '@material-ui/icons';
import messages from '../../../../areas/public/features/task/messages/task-messages';

const useStyles = makeStyles((theme) => ({
  root: {
    flexShrink: 0,
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing(2.5),
  },
}));

const TablePaginationActions = ({ count, page, rowsPerPage, onPageChange }) => {
  const classes = useStyles();
  const theme = useTheme();
  const intl = useIntl();

  const handleFirstPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange?.(event, 0);
  };

  const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange?.(event, page - 1);
  };

  const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange?.(event, page + 1);
  };

  const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange?.(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  const { direction } = theme;
  const isRtl = direction && direction === 'rtl';

  return (
    <div className={classes.root}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label={intl.formatMessage(messages.firstPageLabel)}
      >
        {isRtl ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label={intl.formatMessage(messages.previousPageLabel)}
      >
        {isRtl ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label={intl.formatMessage(messages.nextPageLabel)}
      >
        {isRtl ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label={intl.formatMessage(messages.lastPageLabel)}
      >
        {isRtl ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </div>
  );
};

export default TablePaginationActions;