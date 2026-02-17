import { checkoutSessionCompletedService } from '../../services/webhooks/checkoutSessionCompletedService'

export default async function checkoutSessionCompleted(event: any, req: any, res: any) {
  const result = await checkoutSessionCompletedService({ event, requestBody: req.body })
  return res.status(result.status).json(result.body)
}
