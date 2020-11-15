const AuthToken = require('../models/authtoken');
const { Op } = require('sequelize');

exports.create = (token) => {
    id = req.body.id;
    token = req.body.token;
    expireAt = req.body.expireAt;
    xsrfToken = req.body.xsrfToken;
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
