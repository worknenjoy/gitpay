import React from 'react'
import Drawer from '../../molecules/drawer/drawer'
import TaskDeadlineForm from '../../../task/task-deadline-form'

type TaskDeadlineDrawerProps = {
  open: boolean
  onClose: () => void
  taskId: number
  task: any
  onUpdate: (task: any) => void
  classes?: any
}

const TaskDeadlineDrawer = ({ 
  open,
  onClose,
  taskId,
  task,
  onUpdate,
  classes
}: TaskDeadlineDrawerProps) => {
  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Set task deadline"
    >
      <TaskDeadlineForm 
        match={{ params: { id: taskId } }}
        classes={classes}
        open={open}
        task={task}
        updateTask={(task) => {
          onUpdate(task)
          onClose()
        }}
      />
    </Drawer>
  )
}

export default TaskDeadlineDrawer 