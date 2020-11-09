const { Sequelize } = require('sequelize');
// Define postgres server configuration
const sequelize = new Sequelize('backend_test', 'tester', 'test123', {
    host: 'localhost',
    dialect: 'postgres'
});

module.exports = sequelize
