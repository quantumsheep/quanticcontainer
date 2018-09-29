const router = require('express').Router();

const controllers = {
    files: require('./controllers/files'),
}

router.get('/files', controllers.files.getFiles);

module.exports = router;