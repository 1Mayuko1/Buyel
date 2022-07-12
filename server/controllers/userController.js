const ApiError = require('../error/ApiError');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {User, RecipeInfo} = require('../models/models')

const generateJwt = (id, email, role, userName, diet, img, pfc) => {
    return jwt.sign(
        {id, email, role, userName, diet, img, pfc},
        process.env.SECRET_KEY,
        {expiresIn: '24h'}
    )
}

class UserController {
    async registration(req, res, next) {
        try {
            const {email, password, role, userName} = req.body

            if (!email || !password) {
                return next(ApiError.badRequest('Некоректний email чи пароль'))
            }
            const candidate = await User.findOne({where: {email}})
            if (candidate) {
                return next(ApiError.badRequest('Користувач з таким email уже існує'))
            }
            const hashPassword = await bcrypt.hash(password, 5)

            const user = await User.create({
                email,
                role,
                password: hashPassword,
                userName
            })

            const token = await generateJwt(
                user.id, user.email, user.role, user.userName,
                user.diet, user.img, user.pfc
            )
            const recipeInfo = await RecipeInfo.create({userId: user.id})
            return res.json({token})

        } catch (e) {

            next(e.message)
            console.log('Помилка з registration: ', e)
        }
    }

    async login(req, res, next) {
        const {email, password} = req.body
        const user = await User.findOne({where: {email}})
        if (!user) {
            return next(ApiError.internal('Корисстувача не знайдено'))
        }

        let comparePassword = bcrypt.compareSync(password, user.password)
        if (!comparePassword) {
            return next(ApiError.internal('Вказаний неправильний пароль'))
        }

        const token = await generateJwt(
            user.id, user.email,
            user.role, user.userName,
            user.diet, user.img,
            user.pfc
        )
        return res.json({token})
    }

    async check(req, res) {
        const token = generateJwt(req.user.id, req.user.email, req.user.role)
        return res.json({token})
    }

    async deleteOne(req, res, next) {
        try {
            const {id} = req.params
            if (Number.isNaN(id)) {
                return next(ApiError.badRequest('Неправильного формату id'))
            }
            const user = await User.findOne({where: {id}})
            if (!user) {
                return res.json({message: 'Користувача з таким ID немає в базі'})
            }
            await User.destroy({ where: {id}})
            return res.json(user)
        }catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getOne(req, res) {
        const {id} = req.params
        const user = await User.findOne({where: {id}})
        if (!user) {
            return res.json({message: 'Користувача з таким ID немає в базі'})
        }
        return res.json(user)
    }

    async getAll(req, res) {
        const user = await User.findAll()
        return res.json(user)
    }

    async updateInfo(req, res) {
        try {
            const id = req.params.id
            const {diet, pfc} = req.body
            const user = await User.findOne({where: {id}})
            if (!user) {
                return res.json({message: 'Користувача з таким ID немає в базі'})
            }

            if (diet) {
                await User.update({diet: diet}, {where: {id: id}})

                const user = await User.findOne({where: {id}})
                const token = await generateJwt(
                    user.id, user.email, user.role, user.userName,
                    user.diet, user.img, user.pfc
                )
                return res.json({token})
            }

            if (pfc) {
                await User.update({pfc: pfc}, {where: {id: id}})

                const user = await User.findOne({where: {id}})
                const token = await generateJwt(
                    user.id, user.email, user.role, user.userName,
                    user.diet, user.img, user.pfc
                )
                return res.json({token})
            }
        } catch (e) {
            console.log('err update -', e)
        }
    }
}

module.exports = new UserController()
