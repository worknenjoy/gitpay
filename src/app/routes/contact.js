const express = require('express')
const router = express.Router()
const controllers = require('../controllers/contact')

router.post('/recruiters', controllers.contactRecruiters)

module.exports = router
