const Router = require('express')
const router = new Router()
const usersProductsRouter = require('../controllers/usersProductsController')

router.post('/user/:userId/', usersProductsRouter.create)
router.get('/user/:userId', usersProductsRouter.getAllUserProductsByDate)
router.get('/:userId/', usersProductsRouter.getAllUserProducts)
router.get('/', usersProductsRouter.getAllProducts)
router.delete('/:userId/', usersProductsRouter.deleteAllUserProducts)
router.delete('/user/:userId', usersProductsRouter.deleteAllUserProductsByDate)

// Не працює разом з deleteAllUserProducts, Роут виключно для тестування
// router.delete('/:id', usersProductsRouter.deleteUserProductsById)

module.exports = router
