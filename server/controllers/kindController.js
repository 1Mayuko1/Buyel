const {Kind} = require('../models/models')
const ApiError = require('../error/ApiError')

class KindController {
    async create (req, res) {
        const {name} = req.body
        const kind = await Kind.findOne({where: {name}})
        if (kind) {
            return res.json({message: 'Уже є вид з такою назвою'})
        }
        const kindValue = await Kind.create({name})
        return res.json(kindValue)
    }

    async getAll (req, res) {
        const kinds = await Kind.findAll()
        return res.json(kinds)
    }

    async deleteOne (req, res, next) {
        try {
            const {id} = req.params
            if (Number.isNaN(id)) {
                return next(ApiError.badRequest('Неправильного формату id'))
            }
            const kind = await Kind.findOne({where: {id}})
            if (!kind) {
                return res.json({message: 'Вид з таким ID не знайдено'})
            }
            await Kind.destroy({ where: {id}})
            return res.json(kind)
        }catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
}

module.exports = new KindController()
