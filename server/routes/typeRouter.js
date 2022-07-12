const Router = require('express')
const router = new Router()
const typeController = require('../controllers/typeController')
const checkRole = require('../middleware/checkRoleMiddleware')

// router.post('/', checkRole('ADMIN'), typeController.create)
router.post('/', typeController.create)
router.get('/', typeController.getAll)
router.delete('/:id', typeController.deleteOne)

module.exports = router

