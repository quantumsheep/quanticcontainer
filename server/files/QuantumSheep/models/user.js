const db = require('../db');

const schema = new db.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true }
});

const entity = db.model('User', schema);
exports.entity = entity;


// -----------------------------------------
// THIS PART IS DEDICATED TO MODEL'S METHODS
// -----------------------------------------
const bcrypt = require('bcrypt');

const helpers = require('../helpers');

/**
 * 
 * @param {string} email 
 * @param {string} password 
 * 
 * @returns {Promise<boolean>} 
 */
exports.checkCredentials = (email, password) => new Promise(async (resolve, reject) => {
    if (!email || !password || !helpers.isEmail(email)) {
        return resolve(false);
    }

    try {
        const user = await entity.findOne({ email }, ['password']);

        if(!user) {
            return resolve(false);
        }

        const valid = await bcrypt.compare(password, user.password);

        resolve(valid);
    } catch (e) {
        reject(e);
    }
});