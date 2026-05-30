// Créer un router
const router = require('express').Router();
const apiUsers = require('./users');
const apiAuth = require('./auth/auth');
const apiRecipes = require ('./recipes');

router.use('/users', apiUsers)
router.use('/', apiAuth);
router.use('/recipes', apiRecipes);

module.exports = router;