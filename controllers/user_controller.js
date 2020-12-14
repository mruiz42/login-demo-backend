const User = require('../models/user');
const { Op } = require('sequelize');

const {
    refreshTokens, COOKIE_OPTIONS, generateToken, generateRefreshToken,
    getCleanUser, verifyToken, clearTokens, handleResponse,
} = require('../utils/token');
const {hash, compare} = require('../utils/crypto')

// Create a new User
exports.create = (req, res) => {
    // Check if req has the content we need
    if (!req.body.username || !req.body.email || !req.body.password || !req.body.name) {
        console.log("Request cannot be empty")
        return;
    }
    // Check if username or email exists in database
    else if (userExists(req.body.username, req.body.email).then(res => {
        console.log(res)
    })) {
        console.log("User credentials already exist");
        return;
    }
    // If it does not we can proceed to adding the user to database
    else {
        // TODO: Salt and hash password
        const hash = hash(req.body.password)

        // TODO: validate email, user and password to conform to 255 varchar constraints
        User.create({
            username: req.body.username,
            email: req.body.email,
            name: req.body.name,
            password: hash
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

async function userExists(username, email) {
    const user = await User.findOne({
        where: {
            [Op.or]: [
                {email: email},
                {username: username}
            ]
        }
    })
}

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

exports.authenticateCredentials = (req, res) => {
    // If user does not enter a username or password
    if (!req.body.email || !req.body.password) {
        console.log("user and password must be entered.")
        return handleResponse(req, res, 400, null, "Username and Password required.");
      }
    else {
        User.findOne({
            where: { email: req.body.email, password: req.body.password }
        }).then(data => {
            if (data === null) {
                console.log("not found");
                return handleResponse(req, res, 401, null, "Unrecognized username or password.");
            }
            else {
                let user = data.dataValues;
                console.log(user);
                if (compare(res.password, data.dataValues.password)) {
                    let newToken = generateToken(user);
                    console.log(newToken);
                    res.cookie('token', newToken, {httpOnly: true});
                    res.send(newToken);
                    newToken.id = user.id;
                }
                else {
                    return handleResponse(req, res, 401, null, "Unrecognized username or password.");
                }
            }
        })
    }
}

exports.authenticateToken = (req, res) => {
    token = req.token;

}

