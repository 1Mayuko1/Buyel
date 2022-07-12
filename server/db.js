const { Sequelize } = require('sequelize')

module.exports = new Sequelize(
    process.env.DB_NAME || 'postgres',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || 'root',
    {
        dialect: 'postgres',
        host: process.env.DB_HOST || '0.0.0.0',
        port: parseInt(process.env.DB_PORT || '5432')
    }
)
