const {Recipe, RecipeInfo} = require('../models/models')
const ApiError = require('../error/ApiError');

class RecipeController {
    async create(req, res, next) {
        try {
            let {name, shortInfo, calories, kindId, typeId, info, img} = req.body
            // const {img} = req.files
            // let fileName = uuid.v4() + ".jpg"
            // img.mv(path.resolve(__dirname, '..', 'static', fileName))

            // const recipeByName = await Recipe.findOne({where: {name: name}})
            // if (!recipeByName) {
            //     return res.json({message: 'Такий рецепт уже існує'})
            // }

            const recipe = await Recipe.create({
                name, shortInfo,
                calories, kindId,
                typeId,
                img
            })

            if (info) {
                info = JSON.parse(info)
                info.forEach(i => RecipeInfo.create({
                    title: i.title,
                    description: i.description,
                    recipeId: recipe.id
                }))
            }

            return res.json(recipe)
        } catch (e) {
            next(e.message)
            console.log('це вручну виведено: ', e)
        }

    }

    async getAll(req, res) {
        let {kindId, typeId, limit, page} = req.query
        page = page || 1
        limit = limit || 10

        let offset = page * limit - limit

        let recipes;

        if(!kindId && !typeId) {
            recipes = await Recipe.findAndCountAll({offset})
        }
        if(kindId && !typeId) {
            recipes = await Recipe.findAndCountAll({where: {kindId}, offset})
        }
        if(!kindId && typeId) {
            recipes = await Recipe.findAndCountAll({where: {typeId}, offset})
        }
        if(kindId && typeId) {
            recipes = await Recipe.findAndCountAll({where: {kindId, typeId}, offset})
        }

        return res.json(recipes)
    }

    async getOne(req, res) {
        const {id} = req.params
        const recipe = await Recipe.findOne(
            {
                where: {id},
                include: [{model: RecipeInfo, as: 'info'}]
            },
        )
        return res.json(recipe)
    }

    async deleteOne (req, res, next) {
        try {
            const {id} = req.params
            if (Number.isNaN(id)) {
                return next(ApiError.badRequest('Неправильного формату id'))
            }
            const recipe = await Recipe.findOne({where: {id}})
            if (!recipe) {
                return res.json({message: 'Рецепту з таким ID не знайдено'})
            }
            await Recipe.destroy({ where: {id}})
            return res.json(recipe)
        }catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
}

module.exports = new RecipeController()
