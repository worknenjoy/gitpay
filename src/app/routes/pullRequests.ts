import express from 'express'
import secure from './secure'
import * as controllers from '../controllers/pull-request'

const router = express.Router()

router.use(secure)
router.get('/', controllers.resolvePullRequest)
router.get('/mine', controllers.searchMyPullRequests)
router.post('/:paymentRequestId/comment', controllers.postPullRequestComment)

export default router
