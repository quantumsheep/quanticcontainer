const router = require('express').Router();

const controllers = {
    files: require('../controllers/files'),
    users: require('../controllers/users'),
}

router.post('/login', controllers.users.login);

router.get('/files/*', controllers.files.getUserFiles);

// Special routes
router.get('/identify', (req, res) => res.send(req.session.connected === true));

module.exports = router;