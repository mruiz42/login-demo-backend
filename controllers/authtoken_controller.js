const AuthToken = require('../models/authtoken');
const {handleResponse} = require("../utils");
const { Op } = require('sequelize');

exports.create = (tkn) => {
    //this is wrong
    id = tkn.id;
    token = tkn.token;
    expireAt = tkn.expiredAt;
    xsrfToken = tkn.xsrfToken;
    if (!id || !token || !expireAt || !xsrfToken) {
        console.log("Token data is null and cannot be verified.");
        return;
    }
    else {
        AuthToken.create({
            userid: id,
            token: token,
            expireAt: expireAt,
            xsrfToken: xsrfToken
        })
    }
}
exports.delete = (tkn) => {
    token = tkn
}
exports.validate = (req, res) => {
    let reqToken = req.headers['authorization'];
    if (!reqToken) return handleResponse(req, res, 401);
    reqToken = reqToken.replace('Bearer ', '');

    AuthToken.findAll({
        where: {
            token: reqToken
        }
    }).then(data => {
        if (!data) {
            console.log("Access denied.")
            return;
        }
        else {
            const timeNow = new Date();
            for (const i in data) {
                if (data[i].dataValues.expireAt >= timeNow) {
                    // if stored token expired already
                    console.log("invalid");

                }
                else {

                }
            }

            console.log("User permitted")
            res.send({data});
        }
    })
}

exports.sync = (req, res) => {
    AuthToken.sync().then(res.send({msg: "200"}));
}
