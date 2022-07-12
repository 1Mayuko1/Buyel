const {Type} = require('../models/models')
const ApiError = require('../error/ApiError')

class TypeController {
    async create (req, res) {
        const {name} = req.body

        const type = await Type.findOne({where: {name}})
        if (type) {
            return res.json({message: 'Уже є тип з такою назвою'})
        }

        const typeValue = await Type.create({name})
        return res.json(typeValue)
    }

    async getAll (req, res) {
        const types = await Type.findAll()
        return res.json(types)
    }

    async deleteOne (req, res, next) {
        try {
            const {id} = req.params
            if (Number.isNaN(id)) {
                return next(ApiError.badRequest('Неправильного формату id'))
            }
            const type = await Type.findOne({where: {id}})
            if (!type) {
                return res.json({message: 'Тип з таким ID не знайдено'})
            }
            await Type.destroy({ where: {id}})
            return res.json(type)
        }catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
}

module.exports = new TypeController()
