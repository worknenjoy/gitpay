import userUpdate from './userUpdate'

const userDisconnectGithub = async ({userId}: {userId: number}): Promise<boolean> => {
  return userUpdate({
    id: userId,
    provider: null,
    provider_username: null,
    provider_id: null,
    provider_email: null
  })
    .then((userUpdated: any) => {
      if (userUpdated) {
        return true
      } else {
        return false
      }
    })
    .catch((e) => {
      console.log('Error disconnecting github account:', e)
      return false
    })
}

export default userDisconnectGithub
