const Sequelize = require('sequelize');
const sql = require('../utils/database');

const AuthToken = sql.define('AuthToken', {
    userid: {
        type: Sequelize.INTEGER,
        foreignKey: 'user',
        sourceKey: 'id',
        unique: false,
        allowNull: false,
    },
    token: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: false
    },
    expireAt: {
        type: Sequelize.DATE,
        allowNull: false,
        unique: false
    },
    xsrfToken: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: false
    }
});

module.exports = AuthToken
