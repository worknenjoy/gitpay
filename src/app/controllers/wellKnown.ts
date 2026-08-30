import path from 'path'
import { Request, Response } from 'express'

export const appleDeveloperMerchantIdDomainAssociation = (req: Request, res: Response) => {
  const filePath = path.join(
    __dirname,
    '../../../frontend/public/.well-known/apple-developer-merchantid-domain-association'
  )

  res.sendFile(filePath, (err: Error) => {
    if (err) {
      console.error('Could not find Apple verification file at:', filePath)
      res.status(404).send('Verification file missing on server')
    }
  })
}
