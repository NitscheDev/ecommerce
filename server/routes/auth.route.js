const router = require('express').Router()
const { seed, loginHandler, protected } = require('../controllers/auth.controller')
const { requireAuth } = require('../middleware/auth')

router.get('/', seed)
router.post('/login', loginHandler)
router.get('/protected', requireAuth, protected)


module.exports = router