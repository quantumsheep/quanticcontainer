const router = require('express').Router();

const controllers = {
    files: require('../controllers/files'),
    users: require('../controllers/users'),
}

router.post('/login', controllers.users.login);
router.post('/register', controllers.users.register);
router.post('/logout', controllers.users.identify);

router.get('/identify', controllers.users.identify);

router.get('/files/*', controllers.files.getUserFiles);

module.exports = router;