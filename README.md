# Backend Login
A simple login interface server backend using express js, node js, jwt, postgres sql and sequelize.

## Getting started
1. To get started you will want to first setup your postgresql environment by installing postgres on your machine and 
creating a new postgres user and database for use with this project. You will need to enter the `database name`,
`username` and `user password` into the arguments of `./utils/database.js`. This should allow a database connection.
<br> 
**In the future we may switch to using ./config/config.json as sql params instead of hardcoding `./utils/database.js`**
</br>

2. Copy `.env` and `.sequelizerc` from `./examples/` into the root directory. Customize as needed.
3. Copy `config.json` from `./examples/` and paste into `./config/`. Customize as needed.
4. Next, you will want to run `npm i` to install the dependencies from the package.json. 
5. Run `npm start` to start the server as a nodemon service.
