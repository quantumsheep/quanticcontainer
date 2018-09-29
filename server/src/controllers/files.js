const path = require('path');
const fs = require('fs');

const filespath = path.resolve('files');

/**
 * @param {string} path 
 */
const getFileStruct = path => new Promise((resolve, reject) => {
    fs.stat(path, (err, stats) => {
        if (err) return reject(err);

        resolve({
            name: file,
            isDir: stats.isDirectory(),
        });
    });
});

/**
 * @param {string} username 
 * @param {string} path 
 */
const getFiles = (username, path = '') => new Promise((resolve, reject) => {
    const filepath = `${filespath}/${username}/${path}`;

    fs.readdir(filepath, async (err, files) => {
        if (err) return reject(err);

        try {
            const promisesFiles = files.map(async file => await getFileStruct(`${filepath}/${file}`));

            resolve(await Promise.all(promisesFiles));
        } catch (e) {
            reject(e);
        }
    });
});

/**
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
exports.getUserFiles = async (req, res) => {
    if(!req.session.connected) {
        res.status(403).send([]);
    }

    const username = req.param('username', req.session.user.username);
    const path = req.param('path', '');

    const files = await getFiles(username, path);

    res.send(files);
}