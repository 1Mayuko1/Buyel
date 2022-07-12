const Router = require('express')
const router = new Router()
const productsController = require('../controllers/productsController')
const checkRole = require('../middleware/checkRoleMiddleware')

// router.post('/', checkRole('ADMIN'), productsController.create)
router.post('/', productsController.create)
router.get('/', productsController.getAll)
// router.delete('/:id', typeController.deleteOne)

module.exports = router

