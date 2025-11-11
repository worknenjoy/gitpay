import UserProfilePublicPage from 'design-library/pages/public-pages/user-profile-public-page/user-profile-public-page'
import React from 'react'
import { useParams } from 'react-router-dom'

const ProfilePage = ({
  user,
  getUserTypes,
  tasks,
  listTasks,
  filterTasks
}) => {
  const { username } = useParams<{ username: string }>()

  return (
    <UserProfilePublicPage
      user={user}
      getUserTypes={getUserTypes}
      tasks={tasks}
      listTasks={listTasks}
      filterTasks={filterTasks}
    />
  )
}

export default ProfilePage