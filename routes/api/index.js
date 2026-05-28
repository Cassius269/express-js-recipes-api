// Créer un router
const router = require('express').Router();
const apiUsers = require('./users');
const apiAuth = require('./auth/auth');

router.use('/users', apiUsers)
router.use('/auth', apiAuth);

module.exports = router;