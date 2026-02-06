/**
 * Authentication helpers to determine if a user is logged in or not
 * before a route returns information to the response
 */

import { Request, Response, NextFunction } from 'express'
import { userExists } from '../../modules/users'
import { userTasks } from '../../modules/users'
import jwt, { VerifyErrors, JwtPayload } from 'jsonwebtoken'

function isAuthOrRedirect(req: Request, res: Response, next: NextFunction): void {
  if (req.isAuthenticated()) return next()

  res.redirect('/')
}

function isNotAuthOrRedirect(req: Request, res: Response, next: NextFunction): void {
  if (!req.isAuthenticated()) return next()

  res.redirect('/')
}

function isAuth(req: Request, res: Response, next: NextFunction): void {
  // if (req.isAuthenticated()) return res.send({ 'authenticated': true });
  const token = req.headers.authorization?.split(' ')[1]

  if (token) {
    jwt.verify(
      token,
      process.env.SECRET_PHRASE as string,
      (err: VerifyErrors | null, decoded: string | JwtPayload | undefined) => {
        // the 401 code is for unauthorized status
        if (err || !decoded) {
          res.status(401).end()
          return
        }

        const userData = decoded as any
        // check if a user exists
        userExists(userData)
          .then((user: any) => {
            return userTasks(user.dataValues.id).then((tasks: any) => {
              // assigns 'tasks' and 'bounties' to user object
              user.dataValues['tasks'] = tasks.tasks
              user.dataValues['bounties'] = tasks.bounties
              res.send({ authenticated: true, user: user })
            })
          })
          .catch((e: any) => {
            // eslint-disable-next-line no-console
            console.log('error to sign user', e)
            res.status(401).end()
          })
      }
    )
  } else {
    next()
  }
}

function isNotAuth(req: Request, res: Response, next: NextFunction): void {
  if (!req.isAuthenticated()) return next()

  res.send({ authenticated: true })
}

export { isAuthOrRedirect, isNotAuthOrRedirect, isAuth, isNotAuth }
