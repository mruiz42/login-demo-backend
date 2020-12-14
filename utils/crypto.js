// This file serves as a convenience wrapper around the bcrypt library.
const bcrypt = require('bcrypt');
const saltRounds = 10;

function hash(plaintext) {
    bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(plaintext, salt, function(err, hash) {
            return hash
        });
    })
}

function compare(plaintext, hash) {
    //TODO: Not time safe comparison, maybe add a wait here?
    return bcrypt.compareSync(plaintext, hash);
}

module.exports = {hash, compare}
