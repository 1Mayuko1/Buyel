const Router = require('express')
const router = new Router()

const recipeRouter = require('./recipeRouter')
const userRouter = require('./userRouter')
const productsRouter = require('./productsRouter')
const typeRouter = require('./typeRouter')
const kindRouter = require('./kindRouter')
const usersProductsRouter = require('./usersProductsRouter')
const recipeInfoRouter = require('./recipeInfoRouter')

router.use('/user', userRouter)
router.use('/products', productsRouter)
router.use('/type', typeRouter)
router.use('/kind', kindRouter)
router.use('/recipe', recipeRouter)
router.use('/recipe_info', recipeInfoRouter)
router.use('/users_products', usersProductsRouter)

module.exports = router


