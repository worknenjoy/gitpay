import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import { withRouter } from 'react-router-dom'
import MomentComponent from 'moment'
import TextEllipsis from 'text-ellipsis'

import Avatar from 'material-ui/Avatar'
import Table, {
  TableHead,
  TableBody,
  TableCell,
  TableFooter,
  TablePagination,
  TableRow
} from 'material-ui/Table'
import Tooltip from 'material-ui/Tooltip'
import Chip from 'material-ui/Chip'
import Paper from 'material-ui/Paper'
import IconButton from 'material-ui/IconButton'
import FirstPageIcon from 'material-ui-icons/FirstPage'
import KeyboardArrowLeft from 'material-ui-icons/KeyboardArrowLeft'
import KeyboardArrowRight from 'material-ui-icons/KeyboardArrowRight'
import LastPageIcon from 'material-ui-icons/LastPage'

const logoGithub = require('../../images/github-logo.png')
import Constants from '../../consts'

const actionsStyles = theme => ({
  root: {
    flexShrink: 0,
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing.unit * 2.5,
  },
});

class TablePaginationActions extends React.Component {
  handleFirstPageButtonClick = event => {
    this.props.onChangePage(event, 0);
  };

  handleBackButtonClick = event => {
    this.props.onChangePage(event, this.props.page - 1);
  };

  handleNextButtonClick = event => {
    this.props.onChangePage(event, this.props.page + 1);
  };

  handleLastPageButtonClick = event => {
    this.props.onChangePage(
      event,
      Math.max(0, Math.ceil(this.props.count / this.props.rowsPerPage) - 1),
    );
  };

  render() {
    const { classes, count, page, rowsPerPage, theme } = this.props;

    return (
      <div className={classes.root}>
        <IconButton
          onClick={this.handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label="First Page"
        >
          {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
        </IconButton>
        <IconButton
          onClick={this.handleBackButtonClick}
          disabled={page === 0}
          aria-label="Previous Page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
        </IconButton>
        <IconButton
          onClick={this.handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="Next Page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
        </IconButton>
        <IconButton
          onClick={this.handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="Last Page"
        >
          {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
        </IconButton>
      </div>
    );
  }
}

TablePaginationActions.propTypes = {
  classes: PropTypes.object.isRequired,
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  theme: PropTypes.object.isRequired,
};

const TablePaginationActionsWrapped = withStyles(actionsStyles, { withTheme: true })(
  TablePaginationActions,
);

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
  },
  table: {
    minWidth: 500
  },
  tableWrapper: {
    overflowX: 'auto',
  },
});

class CustomPaginationActionsTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      page: 0,
      rowsPerPage: 5,
    };
  }

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  handleClickListItem = id => {
    this.props.history.push('/task/' + id);
  }

  render() {
    const { classes, tasks } = this.props;
    const { rowsPerPage, page } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, tasks.data.length - page * rowsPerPage);

    return (
      <Paper className={classes.root}>
        <div className={classes.tableWrapper}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>Autor</TableCell>
                <TableCell>Tarefa</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Valor</TableCell>
                <TableCell>Vencimento</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tasks.data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(n => {
                return (
                  <TableRow key={n.id}>
                    <TableCell component="th" scope="row" style={{padding: 5}}>
                      { n.User.profile_url ?
                        (
                          <a style={{display: 'flex', alignItems: 'center', height: 20}} target="_blank"
                             href={n.User.profile_url}>
                            <Avatar
                              src={n.User.picture_url}
                              style={{width: 24, height: 24, display: 'inline-block'}}
                            />
                            <span style={{marginLeft: 10}}>{n.User.username}</span>
                          </a>
                        ) : (
                          <div>
                            <Avatar
                              src={n.User.picture_url}
                              style={{width: 24, height: 24, display: 'inline-block'}}
                            />
                            <span style={{marginLeft: 10}}>{n.User.username}</span>
                          </div>
                        )
                      }
                    </TableCell>
                    <TableCell component="th" scope="row" style={{padding: 10}}>
                      <div style={{width: 250, display: 'flex', alignItems: 'center'}}>
                        <a style={{cursor: 'pointer'}} onClick={() => this.handleClickListItem(n.id)}>
                          {TextEllipsis(`${n.title || 'sem título'}`, 30)}
                        </a>
                        <Tooltip id="tooltip-fab" title="Ver no Github" placement="right">
                          <a target="_blank" href={n.url}>
                            <img width="16" src={logoGithub} style={{backgroundColor: 'black', marginLeft: 10}} />
                          </a>
                        </Tooltip>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div style={{width: 80}}>
                        <Chip label={Constants.STATUSES[n.status]} style={{ backgroundColor: `${Constants.STATUSES_COLORS[n.status]}`, color: 'white'}} />
                      </div>
                    </TableCell>
                    <TableCell numeric style={{padding: 5}}>
                      <div style={{width: 40}}>
                        {`$ ${n.value}`}
                      </div>
                    </TableCell>
                    <TableCell numeric style={{padding: 0}}>
                      <div style={{width: 80}}>
                        {n.deadline ? MomentComponent(n.deadline).fromNow() : 'não definido'}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 48 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  colSpan={3}
                  count={tasks.data.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onChangePage={this.handleChangePage}
                  onChangeRowsPerPage={this.handleChangeRowsPerPage}
                  Actions={TablePaginationActionsWrapped}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </Paper>
    );
  }
}

CustomPaginationActionsTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(CustomPaginationActionsTable));
