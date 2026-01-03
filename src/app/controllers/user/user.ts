import userInfo from '../../../modules/users/userInfo'
import userUpdate from '../../../modules/users/userUpdate'

export const getUserInfo = async (req: any, res: any) => {
  const userId = req.user.id
  try {
    const info = await userInfo({ userId })
    res.status(200).json(info)
  } catch (error) {
    console.error('Error fetching user info:', error)
    res.status(500).send('Error fetching user info')
  }
}

export const updateUser = (req: any, res: any) => {
  req.body.id = req.user.id
  userUpdate(req.body)
    .then((data) => {
      res.send(data)
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.log('error to update user', error)
      res.status(500).send('Error updating user')
    })
}
