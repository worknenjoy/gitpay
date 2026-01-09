import userUpdate from './userUpdate'

export const userDisconnectGithub = async (userId: number): Promise<void> => {
  userUpdate({
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
      return false
    })
}
