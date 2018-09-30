const bcrypt = require('bcrypt');

const Users = require('../models/user');

const helpers = require('../helpers');

/**
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
exports.login = async ({ session, body: credentials }, res) => {
    if (session.connected) {
        return res.send(true);
    }

    if (!credentials) {
        return res.send(false);
    }

    try {
        const valid = await Users.checkCredentials(credentials.email, credentials.password);

        if (!valid) {
            return res.send(false);
        }

        session.user = await Users.entity.findOne({ email: credentials.email }, ['username', 'email']);
        session.connected = true;
        session.save();

        res.send(true);
    } catch (e) {
        console.log(e);
        res.send(false);
    }
}

/**
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
exports.register = async ({ session, body: user }, res) => {
    if (session.connected) {
        return res.send(true);
    }

    if (!user || !user.email || !helpers.isEmail(user.email) || !user.username || !helpers.isValidUsername(user.username) || !user.password) {
        return res.send(false);
    }

    try {
        await new Users.entity({
            email: user.email,
            username: user.username,
            password: await bcrypt.hash(user.password, 10),
        }).save();

        res.send(true);
    } catch (e) {
        console.log(e);
        res.send(false);
    }
}

/**
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
exports.identify = (req, res) => {
    res.send(req.session.user || {});
}