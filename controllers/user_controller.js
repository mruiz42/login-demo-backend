const User = require('../models/user');
const { Op } = require('sequelize');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const {
    refreshTokens, COOKIE_OPTIONS, generateToken, generateRefreshToken,
    getCleanUser, verifyToken, clearTokens, handleResponse,
} = require('../utils/token');
const {hash, compare} = require('../utils/crypto')

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

exports.authenticateCredentials = (req, res) => {
    // If user does not enter a username or password
    if (!req.body.email || !req.body.password) {
        console.log("user and password must be entered.")
        return handleResponse(req, res, 400, null, "Username and Password required.");
      }
    else {
        User.findOne({
            where: { email: req.body.email}
        }).then(data => {
            if (data === null) {
                console.log("not found");
                return handleResponse(req, res, 401, null, '');
            }
            else {
                let user = data.dataValues;
                let hash = data.dataValues.password;
                bcrypt.compare(req.body.password, hash)
                    .then(function(result) {
                        if (result) {
                            // Construct 'client-safe' user variable
                            const client_safe_user = {
                                'username': user.username,
                                'name': user.name,
                                'email': user.email,
                            }
                            console.log(user);
                            let token = generateToken(user);
                            // res.cookie('token', token, {httpOnly: true});
                            // handleResponse(req,res,200,null,'OK');
                            return res.json({user: client_safe_user, token});
                            // newToken.id = user.id;
                        }
                        else {
                            console.log("Invalid password entered.")
                            handleResponse(req, res, 403, null, "Unrecognized email or password.")
                        }
                })

            }
        })
    }
}

