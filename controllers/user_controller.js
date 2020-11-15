const User = require('../models/user');
const { Op } = require('sequelize');
const AuthToken = require('./authtoken_controller')
const {
    refreshTokens, COOKIE_OPTIONS, generateToken, generateRefreshToken,
    getCleanUser, verifyToken, clearTokens, handleResponse,
} = require('../utils');

// Create a new User
exports.create = (req, res) => {
    // Check if req has the content we need
    if (!req.body.username || !req.body.email || !req.body.password || !req.body.name) {
        console.log("Request cannot be empty")
        return;
    }
    // Check if username or email exists in database
    else if (this.findOne({username: req.body.username, email: req.body.email})) {
        console.log("User already exists");
        return;
    }
    // If it does not we can proceed to adding the user to database
    else {
        // TODO: validate email, user and password to conform to 255 varchar constraints
        User.create({
            username: req.body.username,
            email: req.body.email,
            name: req.body.name,
            password: req.body.password
        })
            .then(data => {
                res.send(data)
            })
            .catch(err => {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while creating user."
                });
            });
    }
};
//
// // Retrieve all Tutorials from the database.
// exports.findAll = (req, res) => {
//
// };

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
    }).then(data => { res.send(data);})
    .catch(err => {
        res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving username."
        });
    });
};

exports.authenticate = (req, res) => {
    const credential = null;
    // If user does not enter a username or password
    if (!req.body.email || !req.body.password) {
        console.log("user and password must be entered.")
        return;
    }
    else {
        User.findOne({
            where: { email: req.body.email, password: req.body.password }
        }).then(data => {
            let user = data;
            console.log(user);
            let newToken = generateToken(user);
            console.log(newToken);
            res.send(newToken);
            AuthToken.create(newToken)
        })
    }
}

//
// // Update a Tutorial by the id in the request
// exports.update = (req, res) => {
//
// };
//
// // Delete a Tutorial with the specified id in the request
// exports.delete = (req, res) => {
//
// };
//
// // Delete all Tutorials from the database.
// exports.deleteAll = (req, res) => {
//
// };
//
// // Find all published Tutorials
// exports.findAllPublished = (req, res) => {
//
// };
