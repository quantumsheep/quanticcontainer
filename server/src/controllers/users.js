const user = require('../models/user');

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
        const valid = await user.checkCredentials(credentials.email, credentials.password);

        if (!valid) {
            return res.send(false);
        }

        const account = await user.entity.findOne({ email: credentials.email }, ['username', 'email']);

        session.connected = true;
        session.account = account;
        session.save();

        res.send(true);
    } catch (e) {
        console.log(e);
        res.send(false);
    }
}