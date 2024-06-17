import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Tooltip from '@material-ui/core/Tooltip';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';

import logoGithub from '../../images/github-logo.png';
import logoBitbucket from '../../images/bitbucket-logo.png';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(0),
    marginBottom: theme.spacing(2),
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'flex-start'
  },
  rootCard: {
    maxWidth: 345,
    marginRight: 20
  },
  item: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3)
  },
}));

const ProjectListSimple = ({ listProjects, projects, user }) => {
  const classes = useStyles();

  useEffect(() => {
    listProjects && listProjects();
  }, []);

  const hasOpenIssues = (project) => {
    const hasOpenTasks = project.Tasks.filter(t => t.status === 'open');
    return hasOpenTasks.length > 0;
  };

  const projectsSort = (data) => {
    const projectWithOpenIssues = data.filter(p => hasOpenIssues(p));
    return projectWithOpenIssues.sort((a, b) => b.Tasks.length - a.Tasks.length);
  };

  const projectSortMoreBounties = (data) => {
    return data.sort((a, b) => projectBounties(b.Tasks) - projectBounties(a.Tasks));
  };

  const projectBounties = (data) => {
    return data.map(task => task.value ? task.value : 0).reduce((prev, next) => prev + next, 0);
  };

  const projectBountiesList = (data) => {
    const bounties = projectBounties(data);
    const hasBounties = bounties > 0;
    return hasBounties ? `$${bounties} in open bounties` : 'no bounties';
  };

  const getProjectLink = (p) => {
    const url = user?.id
      ? `/#/profile/organizations/${p.OrganizationId}/projects/${p.id}`
      : `/#/organizations/${p.OrganizationId}/projects/${p.id}`;
    return (
      <Chip 
        style={ { marginLeft: 10 } }
        size='medium'
        clickable
        avatar={ <Avatar>{ p.Tasks.filter(t => t.status === 'open').length }</Avatar> }
        label={ ' open issue(s)' }
        component={ Link }
        href={ url }
      />
    );
  };

  return (
    <div className={ classes.root }>
      { projects && projects.data && projectSortMoreBounties(projectsSort(projects.data)).map(p => (
        <div className={ classes.item } key={ p.id }>
          <Card className={ classes.rootCard }>
            <CardHeader
              avatar={
                <Avatar aria-label='recipe' className={ classes.avatar }>
                  { p.name[0] }
                </Avatar>
              }
              title={ p.name }
              subheader={ `by ${p.Organization && p.Organization.name}` }
            />
            { p.description && (
              <CardContent>
                <Typography variant='body2' color='textSecondary' component='p'>
                  { p.description }
                </Typography>
              </CardContent>
            ) }
            <CardActions disableSpacing style={ { alignItems: 'center' } }>
              <Chip size='medium' label={ projectBountiesList(p.Tasks) } />
              { getProjectLink(p) }
              <IconButton aria-label='provider'>
                <Tooltip id='tooltip-fab' title={ p.Organization && (p.Organization.provider ? p.Organization.provider : 'See on repository') } placement='right'>
                  <a target='_blank' href={ p.Organization && (p.Organization.provider === 'bitbucket' ? `https://bitbucket.com/${p.Organization.name}/${p.name}` : `https://github.com/${p.Organization.name}/${p.name}`) } rel="noreferrer">
                    <img width='28' src={ p.Organization && (p.Organization.provider === 'bitbucket' ? logoBitbucket : logoGithub) } style={ { borderRadius: '50%', padding: 3, backgroundColor: 'black' } } />
                  </a>
                </Tooltip>
              </IconButton>
            </CardActions>
          </Card>
        </div>
      )) }
    </div>
  );
};

export default ProjectListSimple;
