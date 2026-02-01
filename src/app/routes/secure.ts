import jwt from 'jsonwebtoken'
import { userExists } from '../../modules/users'
import type { Request, Response, NextFunction } from 'express'

export default (req: Request, res: Response, next: NextFunction) => {
  // CORS preflight request
  if (req.method === 'OPTIONS') {
    next()
  } else {
    const token =
      req?.body?.token ||
      req?.query?.token ||
      // support with or without 'Bearer '
      (req.headers['authorization'] || '').replace(/Bearer\s+/, '')

    if (!token) return res.status(403).send({ errors: ['No token provided'] })

    jwt.verify(token, process.env.SECRET_PHRASE as string, async (err: any, decoded: any) => {
      if (err) return res.status(403).send({ errors: ['Failed to authenticate token'] })
      ;(req as any).decoded = decoded

      try {
        const user = await userExists(decoded)
        if (!user) {
          return res.status(403).send({ errors: ['User not found'] })
        }
        ;(req as any).user = user
        next()
      } catch (e) {
        return next(e)
      }
    })
  }
}
