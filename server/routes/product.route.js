const router = require('express').Router()
const { getHandler, postHandler }  = require('../controllers/products.controller')


router.get('/', getHandler)
router.post('/', postHandler)


module.exports = router