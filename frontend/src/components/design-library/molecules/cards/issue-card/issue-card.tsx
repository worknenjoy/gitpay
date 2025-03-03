import React, { useState } from "react";
import { FormattedMessage } from "react-intl";
import { Avatar, Card, CardHeader, Link, Tooltip, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import MomentComponent from "moment";
import classNames from "classnames";

import logoGithub from 'images/github-logo-black.png'
import logoBitbucket from 'images/bitbucket-logo-blue.png'
import ReactPlaceholder from "react-placeholder";

const useStyles = makeStyles(theme => ({
  cardHeader: {
    [theme.breakpoints.down('sm')]: {
      display: 'block',
      textAlign: 'center'
    }
  },
  cardAvatar: {
    [theme.breakpoints.down('sm')]: {
      marginRight: 0
    }
  },
  avatar: {
    width: 40,
    height: 40,
    border: `4px solid ${theme.palette.primary.main}`,
    [theme.breakpoints.down('sm')]: {
      margin: 'auto',
      display: 'block',
      marginBottom: 5
    },
  },
  taskTitle: {
    [theme.breakpoints.down('sm')]: {
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }
  },
}));


const IssueCard = ({ issue }) => {
  
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
  }

  const renderIssueAuthorLink = () => {
    if (issue.data.metadata && issue.data.metadata?.issue?.user?.html_url) {
      return (
        <Link
          href={`${issue.data.metadata.issue.user.html_url}`}
          target='_blank'>
          <FormattedMessage id='task.status.created.name.short' defaultMessage='by {name}' values={{
            name: issue.data.metadata ? issue.data.metadata?.issue?.user?.login : 'unknown'
          }} />
        </Link>
      )
    }
    else {
      return (
        <FormattedMessage id='task.status.created.name.short' defaultMessage='by {name}' values={{
          name: issue.data.metadata ? issue.data.metadata?.issue?.user?.login : 'unknown'
        }} />
      )
    }
  }

  const updatedAtTimeString = MomentComponent(issue?.data?.updated_at).utc().format('DD/MM/YYYY hh:mm A')

  return (
    <ReactPlaceholder
      ready={issue.completed}
      showLoadingAnimation={true}
      type='media'
    >
    <Card>
      <CardHeader
        className={classes.cardHeader}
        classes={{ avatar: classes.cardAvatar }}
        avatar={
          <FormattedMessage id='task.status.created.name' defaultMessage='Created by {name}' values={{
            name: issue.data.metadata ? issue.data.metadata?.issue?.user?.login : 'unknown'
          }}>
            {(msg) => (
              <Tooltip
                id='tooltip-github'
                title={msg}
                placement='bottom'
              >
                <a
                  href={`${issue.data.metadata?.issue?.user?.html_url}`}
                  target='_blank' rel="noreferrer"
                >
                  <Avatar
                    src={issue.data.metadata?.issue?.user?.avatar_url}
                    className={classNames(classes.avatar)}
                  />
                </a>
              </Tooltip>
            )}
          </FormattedMessage>
        }
        title={
          <Typography variant='h6' color='primary'>
            <Link
              href={`${issue.data.url}`}
              target='_blank'
              className={classes.taskTitle}>
              {issue.data.title}
              <img width='24' height='24' style={{ marginLeft: 10 }} src={issue.data.provider === 'github' ? logoGithub : logoBitbucket} />
            </Link>
          </Typography>
        }
        subheader={
          <Typography variant='body1' style={{ marginTop: 5 }} color='primary'>
            {renderIssueAuthorLink()}
          </Typography>
        }
        action={
          <Typography variant='caption' style={{ padding: 10, color: 'gray', marginRight: 10 }}>
            <FormattedMessage id='task.bounties.interested.created' defaultMessage='created' /> {updatedAtTimeString}
          </Typography>
        }
      />
    </Card>
    </ReactPlaceholder>
  )
}

export default IssueCard