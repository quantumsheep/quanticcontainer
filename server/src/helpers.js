/**
 * @param {string} str 
 */
exports.isEmail = str => {
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return str.match(emailRegex);
}

/**
 * @param {string} str 
 */
exports.isValidUsername = str => {
    const usernameRegex = /^[a-z0-9_.]+$/i;

    return str.match(usernameRegex);
}