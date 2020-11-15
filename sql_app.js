const { Op } = require('sequelize')
const sequelize = require('./utils/database')
const User = require('./models/user')

async function auth() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

async function user_sync() {
    await User.sync( {force: true});
}

async function user_insert(name, username, email, password) {
    // Create a new user
    const t = await sequelize.transaction();
    try {
        const new_user = await User.create({name: name, username: username, email: email, password: password}, { transaction: t });
        console.log("User's auto-generated ID:", new_user.id);
        await t.commit();
    } catch (error) {
        await t.rollback();
    }
}
async function email_exists(email) {

}

async function user_exists(user) {
    const result = await(User.findOne({
        where: { username: user }
    }));
    if (result !== null ){
        return true
    }
}

async function user_get(name, email) {
    const user = await User.findOne({
        where: {
            [Op.or]: [
                {name: name},
                {email: email}
            ]
        }
    });
    if (user === null) {
        console.log('User not found.');

    } else {
        console.log(user instanceof User);
        console.log(user.email);
    }
}

sequelize.sync( { force: false })  .then(() => {
    console.log(`Database & tables created!`);
    try{
    User.bulkCreate([{ name: "kitty cat", username: "kitten150", email: "kitten@cat.com", password: "kitten123"}])
        .then(function() {
            return User.findAll();
        }).then(function(users) {
            console.log(users);
    })
        } catch (error) {
        console.log(error);
    }
});

