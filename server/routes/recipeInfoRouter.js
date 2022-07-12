const Router = require('express')
const router = new Router()
const RecipeInfoController = require('../controllers/RecipeInfoController')

router.get('/', RecipeInfoController.getAll)
router.get('/:id', RecipeInfoController.getOne)
router.delete('/:id', RecipeInfoController.deleteOne)

module.exports = router
