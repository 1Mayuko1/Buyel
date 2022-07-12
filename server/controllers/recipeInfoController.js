const {RecipeInfo} = require('../models/models')
const ApiError = require('../error/ApiError');

class RecipeInfoController {
    async getAll(req, res) {
        const infos = await RecipeInfo.findAll()
        return res.json(infos)
    }

    async getOne(req, res) {
        const {id} = req.params
        const recipeInfo = await RecipeInfo.findAll(
            {
                where: {id},
            }
        )
        if (!recipeInfo) {
            return res.json({message: 'RecipeInfo з таким Id не знайдено'})
        }
        return res.json(recipeInfo)
    }

    async deleteOne (req, res, next) {
        try {
            const {id} = req.params
            if (Number.isNaN(id)) {
                return next(ApiError.badRequest('Неправильного формату id'))
            }
            const recipeInfo = await RecipeInfo.findOne({where: {id}})
            if (!recipeInfo) {
                return res.json({message: 'RecipeInfo з таким Id не знайдено'})
            }
            await RecipeInfo.destroy({ where: {id}})
            return res.json(recipeInfo)
        }catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
}

module.exports = new RecipeInfoController()
