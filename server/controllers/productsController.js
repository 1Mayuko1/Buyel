const {Products} = require('../models/models')
const ApiError = require('../error/ApiError')

class ProductsController {

    async create (req, res, next) {
        try {
            const {name, proteins, fats, carbs, calories} = req.body
            const product = await Products.findOne({where: {name}})
            if (product) {
                return next(ApiError.badRequest('Продукт з такою назвою уже існує'))
            }
            const productValue = await Products.create({name, proteins, fats, carbs, calories})
            return res.json(productValue)
        } catch (e) {
            console.log('err', e)
        }
    }

    async getAll (req, res) {
        const products = await Products.findAll()
        return res.json(products)
    }

    async deleteOne (req, res, next) {
        try {
            const {id} = req.params

            const product = await Products.findOne({where: {id}})
            if (!product) {
                return res.json({message: 'Продукт з таким id не знайдено'})
            }
            await Products.destroy({ where: {id}})

            return res.json(product)
        }catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
}

module.exports = new ProductsController()
