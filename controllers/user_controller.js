const User = require('../models/user');
const { Op } = require('sequelize')

// // Create and Save a new Tutorial
// exports.create = (req, res) => {
//
// };
//
// // Retrieve all Tutorials from the database.
// exports.findAll = (req, res) => {
//
// };

// Find a single User
exports.findOne = (req, res) => {
    if (!req.body.username || !req.body.email) {
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
    }).then(data => { res.send(data)})
    .catch(err => {
        res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving username."
        });
    });
};
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
