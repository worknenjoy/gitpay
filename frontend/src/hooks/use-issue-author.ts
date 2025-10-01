import { useMemo } from 'react'

export interface IUser {
  id?: string | number | null
}

export interface IMember {
  User?: IUser | null
}

export interface ITaskData {
  User?: IUser | null
  members?: IMember[] | null
}

export interface ITask {
  data?: ITaskData | null
}

/**
 * Returns true when the logged-in user is the issue creator or a member (owner) of the issue.
 */
export default function useIssueAuthor(
  task: ITask | null | undefined,
  user: IUser | null | undefined,
): boolean {
  return useMemo(() => {
    if (!user) return false

    const creator =
      !!task?.data?.User &&
      user?.id != null &&
      task.data.User?.id === user.id

    const owner = Array.isArray(task?.data?.members)
      ? task!.data!.members!.some(m => m?.User?.id === user?.id)
      : false

    return creator || owner
  }, [task, user?.id])
}