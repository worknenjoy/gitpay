import userInfo from '../../../modules/users/userInfo'

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
