const router = require('express').Router()
const { main } = require('../controllers/api.controller')


router.get('/', main)


module.exports = router