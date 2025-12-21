import { useMemo } from 'react'

/**
 * Returns true when the logged-in user is the issue creator or a member (owner) of the issue.
 */
export default function useIssueAuthor(task: any, user: any): boolean {
  const { data: taskData, completed: taskCompleted } = task || {}
  const { data: userData, completed: userCompleted } = user || {}
  return useMemo(() => {
    if (!taskCompleted && !userCompleted) return false

    const creator = !!taskData.User && userData?.id != null && taskData.User?.id === userData.id

    const owner = Array.isArray(taskData?.members)
      ? taskData!.members!.some((m) => m?.User?.id === userData?.id)
      : false

    return creator || owner
  }, [taskData, userData, taskCompleted, userCompleted])
}
