require('dotenv').config(); // charger les variables d'environnement

const express = require('express'); // création de la base de l'application Express
const cookie = require('cookie-parser');
require('./database'); // importe et exécute la connexion MongoDB

const app = express(); // création d'une instance d'Express

// Actification du cors avant les routes
app.use(cors({
  origin: process.env.URL_API,
  credentials: true
}));

const routes = require('./routes'); // récupérer les routes

app.use(express.json()); // transformer le body en json
app.use(cookie()); // extraire le cookie à chaque requête
app.use(routes); // monter les routes

// récupérer toutes les routes et retourner une erreur 404 en cas de route inconnue
app.use('/{*splat}', (req, res) => {
    res.status(404).end();
})

app.listen(process.env.PORT, () => {
    console.log('Le serveur est en marche')
}); // écouter le port 3001 pour le serveur API