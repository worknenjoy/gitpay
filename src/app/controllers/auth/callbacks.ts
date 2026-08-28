export const callbackGithub = (req: any, res: any) => {
  const user = req.user
  if (user && user.token) {
    if (user.login_strategy === 'local' || user.login_strategy === null) {
      res.redirect(
        `${process.env.FRONTEND_HOST}/#/profile/user-account/?connectGithubAction=success`
      )
    } else if (!user.terms_accepted_at) {
      res.redirect(`${process.env.FRONTEND_HOST}/#/accept-terms/${user.token}`)
    } else {
      res.redirect(`${process.env.FRONTEND_HOST}/#/token/${user.token}`)
    }
  }
}

export const callbackBitbucket = (req: any, res: any) => {
  if (req.user && req.user.token) {
    res.redirect(`${process.env.FRONTEND_HOST}/#/token/` + req.user.token)
  }
}
