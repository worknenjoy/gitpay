import { useMemo } from 'react'

/**
 * Returns true when the logged-in user is the issue creator or a member (owner) of the issue.
 */
export default function useIssueAuthor(task: any, user: any): boolean {
  return useMemo(() => {
    if (!user) return false

    const creator =
      !!task?.data?.User && user?.data?.id != null && task.data.User?.id === user.data.id

    const owner = Array.isArray(task?.data?.members)
      ? task!.data!.members!.some((m) => m?.User?.id === user?.data?.id)
      : false

    return creator || owner
  }, [task, user])
}
