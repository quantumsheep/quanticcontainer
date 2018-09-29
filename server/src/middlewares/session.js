const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const { connection } = require('../db');
const helpers = require('../helpers');

const cookieSecret = 'hna3StBXRERf4BMJgJw8mEjXfGATrhNMZXGGcvVpzXRW69bULUZMkC2K9hfDbtab3mdyTFjEzQDYqkW2aA6edyQsCRf2TMmPrEwueZtfcqfA29nxCDrhT6Xaw6BELmhw';
const day = 24 * 60 * 60 * 1000;

module.exports = session({
    name: 'gate',
    secret: cookieSecret,
    resave: true,
    saveUninitialized: true,
    cookie: {
        secure: helpers.isProd,
        httpOnly: true,
        expires: new Date(Date.now() + 31 * day)
    },
    store: new MongoStore({ mongooseConnection: connection })
});