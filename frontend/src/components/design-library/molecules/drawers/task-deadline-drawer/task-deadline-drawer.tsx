import React from 'react'
import Drawer from '../drawer/drawer'
import TaskDeadlineForm from '../../../organisms/forms/task-deadline-form/task-deadline-form'

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
    <Drawer open={open} onClose={onClose} title="Set task deadline">
      <TaskDeadlineForm
        open={open}
        task={task}
        onHandleClearDeadline={() => {
          onUpdate({ id: taskId, deadline: null })
          onClose()
        }}
        onHandleDeadline={(deadline) => {
          onUpdate({ id: taskId, deadline })
          onClose()
        }}
      />
    </Drawer>
  )
}

export default TaskDeadlineDrawer
