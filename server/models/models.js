const sequelize = require('../db')
const { STRING, INTEGER, JSON, TEXT} = require('sequelize')

const User = sequelize.define('user', {
    id: {type: INTEGER, primaryKey: true, autoIncrement: true},
    email: {type: STRING, unique: true,},
    password: {type: STRING},
    role: {type: STRING, defaultValue: "USER"},
    userName: {type: STRING, defaultValue: "User"},
    diet: {type: STRING, defaultValue: "Класична"},
    img: {type: TEXT, defaultValue: ""},
    pfc: {type: JSON, defaultValue: ""}
})

const UsersProducts = sequelize.define('users_products', {
    id: {type: INTEGER, primaryKey: true, autoIncrement: true},
    userId: {type: INTEGER},
    productsValues: {type: JSON},
    date: {type: STRING}
})

const Products = sequelize.define('products', {
    id: {type: INTEGER, primaryKey: true, autoIncrement: true},
    name:{type: STRING, unique: true, allowNull: false},
    proteins: {type: INTEGER},
    fats: {type: INTEGER},
    carbs: {type: INTEGER},
    calories: {type: INTEGER}
})

const Recipe = sequelize.define('recipe', {
    id: {type: INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: STRING, unique: true, allowNull: false},
    shortInfo: {type: TEXT, unique: false, allowNull: false},
    calories: {type: INTEGER, allowNull: false, unique: false},
    rating: {type: INTEGER, defaultValue: 0},
    img: {type: TEXT, allowNull: false},
})

const Kind = sequelize.define('kind', {
    id: {type: INTEGER, primaryKey: true, autoIncrement: true},
    name:{type: STRING, unique: true, allowNull: false}
})
const Type = sequelize.define('type', {
    id: {type: INTEGER, primaryKey: true, autoIncrement: true},
    name:{type: STRING, unique: false, allowNull: false}
})

const Rating = sequelize.define('rating', {
    id: {type: INTEGER, primaryKey: true, autoIncrement: true},
    rate: {type: INTEGER, allowNull: false},
})

const RecipeInfo = sequelize.define('recipe_info', {
    id: {type: INTEGER, primaryKey: true, autoIncrement: true},
    title: {type: STRING, allowNull: false, defaultValue: ''},
    description: {type: TEXT, allowNull: false, defaultValue: ''},
})

const KindType = sequelize.define('kind_type', {
    id: {type: INTEGER, primaryKey: true, autoIncrement: true }
})

Type.hasMany(Recipe)
Recipe.belongsTo(Type)

Kind.hasMany(Recipe)
Recipe.belongsTo(Kind)

Recipe.hasMany(Rating)
Rating.belongsTo(Recipe)

Recipe.hasMany(RecipeInfo, {as: 'info'})
RecipeInfo.belongsTo(Recipe)


Type.belongsToMany(Kind, {through: KindType})
Kind.belongsToMany(Type, {through: KindType})

module.exports = {
    User,
    UsersProducts,
    Products,
    Recipe,
    RecipeInfo,
    Rating,
    Kind,
    Type,
    KindType,
}
