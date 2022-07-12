const Router = require('express')
const router = new Router()
const userController = require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/registration', userController.registration)
router.post('/login', userController.login)
router.get('/auth', authMiddleware, userController.check)
router.delete('/:id', userController.deleteOne)
router.get('/:id', userController.getOne)
router.get('/', userController.getAll)
router.put('/:id', userController.updateInfo)


module.exports = router
