const { Sequelize } = require('sequelize');
require('dotenv').config();

// SQL .env variables
const DATABASE = process.env.SQL_DATABASE;
const USERNAME = process.env.SQL_USER;
const HOST = process.env.SQL_HOST;
const PASSWORD = process.env.SQL_PASS;
const PORT = process.env.SQL_PORT;
const DIALECT = process.env.SQL_DIALECT;
// Define postgres server configuration
const sequelize = new Sequelize(DATABASE, USERNAME, PASSWORD, {
    host: HOST,
    port: PORT,
    dialect: DIALECT
});
// Uncomment this line to initialize the database for the first time
// sequelize.sync()
module.exports = sequelize
