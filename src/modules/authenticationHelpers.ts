/**
 * Authentication helpers to determine if a user is logged in or not
 * before a route returns information to the response
 */

import { Request, Response, NextFunction } from 'express'
import { userExists } from '../modules/users'
import { userTasks } from '../modules/users'
import jwt from 'jsonwebtoken'

function isAuthOrRedirect(req: Request, res: Response, next: NextFunction): void {
  if (req.isAuthenticated()) return next()

  res.redirect('/')
}

function isNotAuthOrRedirect(req: Request, res: Response, next: NextFunction): void {
  if (!req.isAuthenticated()) return next()

  res.redirect('/')
}

function isAuth(req: Request, res: Response, next: NextFunction): any {
  // if (req.isAuthenticated()) return res.send({ 'authenticated': true });
  const token = req.headers.authorization?.split(' ')[1]

  if (token) {
    return jwt.verify(token, process.env.SECRET_PHRASE as string, (err: any, decoded: any) => {
      // the 401 code is for unauthorized status
      if (err) {
        return res.status(401).end()
      }

      const userData = decoded
      // check if a user exists
      return userExists(userData)
        .then((user: any) => {
          return userTasks(user.dataValues.id).then((tasks: any) => {
            // assigns 'tasks' and 'bounties' to user object
            user.dataValues['tasks'] = tasks.tasks
            user.dataValues['bounties'] = tasks.bounties
            return res.send({ authenticated: true, user: user })
          })
        })
        .catch((e: any) => {
          // eslint-disable-next-line no-console
          console.log('error to sign user', e)
          return res.status(401).end()
        })
    })
  }
  return next()
}

function isNotAuth(req: Request, res: Response, next: NextFunction): void {
  if (!req.isAuthenticated()) return next()

  res.send({ authenticated: true })
}

export { isAuthOrRedirect, isNotAuthOrRedirect, isAuth, isNotAuth }
