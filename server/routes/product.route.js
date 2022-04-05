const router = require('express').Router()
const { getHandler, createProduct }  = require('../controllers/products.controller')


router.get('/', getHandler)
router.post('/create', createProduct)


module.exports = router