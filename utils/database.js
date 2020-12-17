const { Sequelize } = require('sequelize');
const data = require('../config/config.json')
const config = data.development
// Define postgres server configuration
const sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: config.dialect
});
// Uncomment this line to initialize the database for the first time
// sequelize.sync()
module.exports = sequelize
