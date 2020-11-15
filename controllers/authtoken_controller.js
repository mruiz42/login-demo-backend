const AuthToken = require('../models/authtoken');
const { Op } = require('sequelize');

exports.create = (tkn) => {
    //this is wrong
    id = tkn.id;
    token = tkn.token;
    expireAt = tkn.expireAt;
    xsrfToken = tkn.xsrfToken;
    if (!id || !token || !expireAt || !xsrfToken) {
        console.log("Token data is null and cannot be verified.");
        return;
    }
    else {
        AuthToken.create({
            id: id,
            token: token,
            expireAt: expireAt,
            xsrfToken: xsrfToken
        })
    }
}

exports.validate = (req, res) => {

}

exports.sync = (req, res) => {
    AuthToken.sync().then(res.send({msg: "200"}));
}
