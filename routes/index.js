// Créer un router
const router = require('express').Router();
const apiRouter = require('./api'); // récupérer le router de la partie API

router.use('/api', apiRouter);
router.get('/api/test', (req, res) => {
    res.json('ok !')
});

// Exportation du router
module.exports = router;