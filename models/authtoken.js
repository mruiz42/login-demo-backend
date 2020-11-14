const Sequelize = require('sequelize');
const sql = require('../utils/database');

const AuthToken = sql.define('AuthToken', {
    id: {
        type: Sequelize.INTEGER,
        foreignKey: true,
        unique: true,
        allowNull: false,
        autoIncrement: true
    },
    token: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: false
    },
    expireAt: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    xsrfToken: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    verified: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    // Timestamps
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE
});

module.exports = User
