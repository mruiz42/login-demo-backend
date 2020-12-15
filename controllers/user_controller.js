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
            handleResponse(req, res, 400, null, "User exists");
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
        hash(req.body.password).then(r => {
            User.findOne({
                where: { email: req.body.email, password: r }
            }).then(data => {
                if (data === null) {
                    console.log("not found");
                    return handleResponse(req, res, 401, null, "Unrecognized username or password.");
                }
                else {
                    let user = data.dataValues;
                    console.log(user);
                    const result = compare(r, data.dataValues.password).then(r2 => {
                        if (r2) {
                            let newToken = generateToken(user);
                            console.log(newToken);
                            res.cookie('token', newToken, {httpOnly: true});
                            res.send(newToken);
                            newToken.id = user.id;
                        }
                        else {
                            return handleResponse(req, res, 401, null, "Unrecognized username or password.");
                        }
                    })

                }
            })
        })

    }
}

exports.authenticateToken = (req, res) => {
    token = req.token;

}

