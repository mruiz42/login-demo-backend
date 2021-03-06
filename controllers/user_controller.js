const User = require('../models/user');
const { Op } = require('sequelize');
const bcrypt = require('bcrypt');
const moment = require('moment');
const saltRounds = 10;

const {
    refreshTokens, COOKIE_OPTIONS, generateToken, generateRefreshToken,
    getCleanUser, verifyToken, clearTokens, handleResponse,
} = require('../utils/token');
const tedis = require("../utils/tedis");
const uuid = require("uuid");
// Create a new User
exports.create = (req, res) => {
    // Check if req has the content we need
    if (!req.body.username || !req.body.name || !req.body.email || !req.body.password) {
        console.log(req)
        console.log("Request cannot be empty");
        handleResponse(req, res, 400, null, "Missing required field")
        return;
    }
    // Check if username or email exists in database
    User.findOne({
        where: {
            [Op.or]: [
                {email: req.body.email},
                {username: req.body.username}
            ]
        }
    }).then(r => {
        if (r) {
            handleResponse(req, res, 401, null, "Username or email already exists.");
            console.log("User credentials already exist");
            return;
        }
        // If it does not we can proceed to adding the user to database
        else {
            // TODO: Salt and hash password
            console.log("Salt password")
            bcrypt.genSalt(saltRounds, function (err, salt) {
                console.log("Hash password")
                bcrypt.hash(req.body.password, salt).then(function(hash) {
                    console.log("Store hashed password")
                    // TODO: validate email, user and password to conform to 255 varchar constraints
                    User.create({
                        username: req.body.username,
                        email: req.body.email,
                        name: req.body.name,
                        password: hash
                    })
                        .then(data => {
                            handleResponse(req, res, 200, null, "OK")
                        })
                        .catch(err => {
                            res.status(500).send({
                                message:
                                    err.message || "Some error occurred while creating user."
                            });
                        });
                });
            })
        }
    });
};
// Find a single User
exports.findOne = (req, res) => {
    if (!req.body) {
        console.log("Request cannot be empty")
        return;
    }
    User.findOne({
        where: {
            [Op.or]: [
                {email: req.body.email},
                {username: req.body.username}
            ]
        }
    })
};

exports.logout = (req, res) => {
    // User wants to logout
    tedis.del(req.cookies.sid)
        .then(data => {
            console.log(data)
            res.cookie('sid', null, {httpOnly: true});
            return handleResponse(req, res, 200, null, "Logged out")
        })


}

exports.authenticateCredentials = (req, res) => {
    // If user does not enter a username or password
    if (!req.body.email || !req.body.password) {
        return handleResponse(req, res, 400, null, "Username and Password required.");
      }
    // Check the user's credentials
    else {
        User.findOne({
            where: { email: req.body.email}
        }).then(data => {
            if (data === null) {
                return handleResponse(req, res, 401, null, 'Unrecognized credentials.');
            }
            else {
                let user = data.dataValues;                         // User array (contains unsafe values do not leak!)
                let hash = data.dataValues.password;                // Create hash of password
                bcrypt.compare(req.body.password, hash)             // Compare the hashed password
                    .then(async function(result) {
                        if (result) {
                            // Construct 'client-safe' user variable
                            console.log("User: " + data.dataValues.username + " authenticated.");
                            let expiry = moment.max().add(1, 'w')
                            const session_data = {
                                'id': user.id,
                                'username': user.username,
                                'name': user.name,
                                'email': user.email,
                                'expiry': expiry
                            }
                            // Now, we want to create a new session id and store it in redis
                            const session_id = uuid.v4()
                            let json = JSON.stringify(session_data)
                            await tedis.set(session_id, json)
                                .then(result => {
                                    if (result) {
                                        res.cookie('sid', session_id, {httpOnly: true});
                                        return handleResponse(req, res, 200, session_data, "Success")
                                    }
                                    else {
                                        return handleResponse(req, res, 403, null, "DEBUG: Redis error.")
                                    }
                            })
                                .catch( e => {
                                    console.log(e);
                                    return handleResponse(req, res, 403, null, "DEBUG: Redis error.");
                                })
                        }
                        else {
                            return handleResponse(req, res, 403, null, "Unrecognized email or password.")
                        }
                })
            }
        })
    }
}

