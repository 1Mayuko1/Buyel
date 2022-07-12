const {UsersProducts, User} = require('../models/models')
const ApiError = require('../error/ApiError')

class UsersProductsController {
    async create(req, res, next) {

        const id = +req.params.userId
        const {productsValues, date} = req.body

        const candidate = await User.findOne({where: {id}})
        if (!candidate) {
            return next(ApiError.badRequest('Користувача з таким id не існує'))
        }

        const productsData = await UsersProducts.create({userId: id, productsValues, date})
        return res.json(productsData)
    }

    async getAllProducts(req, res) {
        const products = await UsersProducts.findAll()
        return res.json(products)
    }

    async getAllUserProducts(req, res, next) {

        const {userId} = req.params

        const candidate = await User.findOne({where: {id: userId}})
        if (!candidate) {
            return next(ApiError.badRequest('Користувача не знайдено'))
        }

        const allUserProducts = await UsersProducts.findAll({where: {userId}})
        if (!allUserProducts) {
            return next(ApiError.badRequest('Продуктів користувача не знайдено'))
        } else if (allUserProducts.length <= 0) {
            return next(ApiError.badRequest('Користувач ще не вносив свої продукти'))
        }

        const products = await UsersProducts.findAll({where: {userId}})
        return res.json(products)
    }

    async getAllUserProductsByDate(req, res, next) {

        const id = req.params.userId
        const {date} = req.query

        const candidate = await User.findOne({where: {id}})
        if (!candidate) {
            return next(ApiError.badRequest('Користувача з таким id не існує'))
        }

        const foundDate = await UsersProducts.findOne({where: {userId: id, date}})
        if (!foundDate) {
            return next(ApiError.badRequest('У вас немає покукпок за цю дату'))
        }

        const products = await UsersProducts.findAll({where: {userId: id, date}})
        return res.json(products)
    }

    async deleteAllUserProducts(req, res, next) {
        try {
            const id = req.params.userId

            const candidate = await User.findAll({where: {id}})
            if (!candidate) {
                return next(ApiError.badRequest('Користувача з таким id не знайдено'))
            }

            const foundDate = await UsersProducts.findAll({where: {userId: id}})
            if (!foundDate) {
                return next(ApiError.badRequest('У вас немає покукпок за цю дату'))
            }

            await UsersProducts.destroy({where: {userId: id}})
            return res.json(foundDate)

        }catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async deleteAllUserProductsByDate(req, res, next) {
        try {
            const id = req.params.userId
            const {date} = req.query

            const candidate = await User.findOne({where: {id}})
            if (!candidate) {
                return next(ApiError.badRequest('Користувача з таким id не знайдено'))
            }

            const foundDate = await UsersProducts.findAll({where: {userId: id, date}})
            if (!foundDate) {
                return next(ApiError.badRequest('У вас немає покукпок за цю дату'))
            }

            await UsersProducts.destroy({where: {userId: id, date}})
            if(foundDate.length <= 0) {
                return next(ApiError.badRequest('У вас немає покукпок за цю дату'))
            }

            return res.json(foundDate)

        }catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async deleteUserProductsById (req, res, next) {
        try {
            const {id} = req.params
            if (Number.isNaN(id)) {
                return next(ApiError.badRequest('Неправильного формату id'))
            }
            const userProducts = await UsersProducts.findOne({where: {id: id}})
            if (!userProducts) {
                return res.json({message: 'Продуктів з таким ID не знайдено'})
            }
            await UsersProducts.destroy({ where: {id}})
            return res.json(userProducts)
        }catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
}

module.exports = new UsersProductsController()
