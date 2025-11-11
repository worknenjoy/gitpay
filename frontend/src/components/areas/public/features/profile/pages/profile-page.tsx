import UserProfilePublicPage from 'design-library/pages/public-pages/user-profile-public-page/user-profile-public-page'
import React from 'react'
import { useParams } from 'react-router-dom'

const ProfilePage = ({
  user,
  searchUser,
  getUserTypes,
  tasks,
  listTasks,
  filterTasks
}) => {

  return (
    <UserProfilePublicPage
      user={user}
      getUserTypes={getUserTypes}
      tasks={tasks}
      listTasks={listTasks}
      filterTasks={filterTasks}
      searchUser={searchUser}
    />
  )
}

export default ProfilePage