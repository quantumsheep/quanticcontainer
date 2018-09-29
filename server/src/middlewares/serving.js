const path = require('path');
const router = require('express').Router();

const helpers = require('../helpers');

const reactPath = '../client/build/';

router.get('*', (req, res, next) => {
    if (req.url === '/' || req.url === '') {
        req.url = '/index.html';
    }

    const filepath = path.resolve(reactPath + req.url);

    res.sendFile(filepath, err => {
        if (err) {
            if (err.code === 'ENOENT') {
                return res.sendFile(path.resolve(`${reactPath}index.html`));
            }

            next();
        }
    });
});

module.exports = router;