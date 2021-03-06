const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
require('dotenv').config()

const {
    refreshTokens, COOKIE_OPTIONS, generateToken, generateRefreshToken,
    getCleanUser, verifyToken, clearTokens, handleResponse,
} = require('../utils/token');
const tedis = require("../utils/tedis");


// Express js server
const app = express();
const PORT = process.env.PORT || 4000;
// User controller for sql commands
const user_ctl = require('../controllers/user_controller');
// enable CORS
const ORIGIN = process.env.FRONTEND_HOST_URL

app.use(cors({
    origin: ORIGIN, // url of the frontend application
    credentials: true // set credentials true for secure httpOnly cookie
}));
// parse application/json
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// use cookie parser for secure httpOnly cookie
app.use(cookieParser(process.env.COOKIE_SECRET));
// middleware that checks if JWT token exists and verifies it if it does exist.
// In all private routes, this helps to know if the request is authenticated or not.


// verify the token and return new tokens if it's valid
app.post('/verify', async function (req, res) {
    // Check if cookie contains an existing session id
    const session_cookie = req.cookies;
    if (!session_cookie.sid) {
        return handleResponse(req, res, 401, null, "Fresh session.");
    }
    else {
        // validate session in redis server
        // get ALL cookies stored in redis
        await tedis.get(session_cookie.sid)
            .then(result => {
                if (!result) {
                    return handleResponse(req, res, 403, null, "No redis")
                }
                else {
                    const resp = JSON.parse(result)
                    // console.log(resp)
                    return handleResponse(req, res, 200, resp, "OK")
                    }
        })
            .catch(e => {
                return handleResponse(req, res, 403, null, e)
        })
    }

});

// get list of the users
// app.get('/users/getList', authMiddleware, (req, res) => {
//     const list = userList.map(x => {
//         const user = { ...x };
//         delete user.password;
//         return user;
//     });
//     return handleResponse(req, res, 200, { random: Math.random(), userList: list });
// });

app.post('/login',(req, res) =>
    user_ctl.authenticateCredentials(req, res)
);

app.post('/logout', (req, res) =>
{
   user_ctl.logout(req, res);
});
app.listen(PORT, () => {
    console.log('Server started on: ' + PORT);
    }
);

app.get('/api', (req, res) => {
    if (!req.cookies.token) return handleResponse(req, res, 401);
    // validate token
    let token = req.cookies.token;
    if (verifyToken(token.token)) {
        res.send("Welcome " )
    }
    else {
        res.send("bye")
    }
});

app.post('/register', user_ctl.create);

