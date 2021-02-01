import React, { useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import LockIcon from '@material-ui/icons/Lock'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function UserTasksList({ listTasks, tasks, user, history }) {
  const classes = useStyles();

  console.log(history)

  useEffect(() => {
    listTasks({ userId: user.id })
  }, []);

  const goToTask = (e, id) => {
    e.preventDefault()
    history.push('/task/' + id)
  }

  return (
    <List component="nav" className={classes.root} aria-label="contacts">
      <Typography variant='h5' style={{marginTop: 20, marginBottom: 10}}>
            Your issues
      </Typography>
      { tasks.data && tasks.data.map(t => {
        return (
          <ListItem button onClick={(e) => goToTask(e, t.id)}>
            <ListItemIcon>
              { t.private && <LockIcon /> }
            </ListItemIcon>
            <ListItemText primary={t.title} />
          </ListItem>
        )
      })}
    </List>
  );
}
