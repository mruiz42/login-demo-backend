require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const {
    refreshTokens, COOKIE_OPTIONS, generateToken, generateRefreshToken,
    getCleanUser, verifyToken, clearTokens, handleResponse,
} = require('../utils/token');


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
const authMiddleware = function (req, res, next) {
    // check header or url parameters or post parameters for token
    var token = req.headers['authorization'];
    if (!token) return handleResponse(req, res, 401);

    token = token.replace('Bearer ', '');

    // get xsrf token from the header
    const xsrfToken = req.headers['x-xsrf-token'];
    if (!xsrfToken) {
        return handleResponse(req, res, 403);
    }

    // verify xsrf token
    const { signedCookies = {} } = req;
    const { refreshToken } = signedCookies;
    if (!refreshToken || !(refreshToken in refreshTokens) || refreshTokens[refreshToken] !== xsrfToken) {
        return handleResponse(req, res, 401);
    }

    // verify token with secret key and xsrf token
    verifyToken(token, xsrfToken, (err, payload) => {
        if (err)
            return handleResponse(req, res, 401);
        else {
            req.user = payload; //set the user to req so other routes can use it
            next();
        }
    });
}

// handle user logout
app.post('/logout', (req, res) => {
    clearTokens(req, res);
    return handleResponse(req, res, 204);
});

app.get('/jwt', (req, res) => {
    token = generateToken('johndoe')
    res.cookie('token', token, { httpOnly: true});
    res.json({token});
});
// verify the token and return new tokens if it's valid
app.post('/verify', function (req, res) {

    const { signedCookies = {} } = req;
    const { refreshToken } = signedCookies;
    if (!refreshToken) {
        return handleResponse(req, res, 204);
    }

    // verify xsrf token
    const xsrfToken = req.headers['x-xsrf-token'];
    if (!xsrfToken || !(refreshToken in refreshTokens) || refreshTokens[refreshToken] !== xsrfToken) {
        return handleResponse(req, res, 401);
    }

    // verify refresh token
    verifyToken(refreshToken, '', (err, payload) => {
        if (err) {
            return handleResponse(req, res, 401);
        }
        else {
            const userData = userList.find(x => x.userId === payload.userId);
            if (!userData) {
                return handleResponse(req, res, 401);
            }

            // get basic user details
            const userObj = getCleanUser(userData);

            // generate access token
            const tokenObj = generateToken(userData);

            // refresh token list to manage the xsrf token
            refreshTokens[refreshToken] = tokenObj.xsrfToken;
            res.cookie('XSRF-TOKEN', tokenObj.xsrfToken);

            // return the token along with user details
            return handleResponse(req, res, 200, {
                user: userObj,
                token: tokenObj.token,
                expiredAt: tokenObj.expiredAt
            });
        }
    });

});

// get list of the users
app.get('/users/getList', authMiddleware, (req, res) => {
    const list = userList.map(x => {
        const user = { ...x };
        delete user.password;
        return user;
    });
    return handleResponse(req, res, 200, { random: Math.random(), userList: list });
});

app.post('/login',
    (req, res) => user_ctl.authenticateCredentials(req, res));

app.post('/auth',
    (req, res) => verifyToken(req));

app.listen(PORT, () => {
    console.log('Server started on: ' + PORT);
});

app.get('/api', (req, res) => {
    if (!req.cookies.token) return handleResponse(req, res, 401);
    // validate token
    let token = req.cookies.token;
    if (verifyToken(token.token)) {
    res.send("Welcome " ) }
    else {
        res.send("bye")
    }

});
// User.sync({force: true})
app.post('/register', user_ctl.create);

