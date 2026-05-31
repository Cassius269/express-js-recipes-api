require('dotenv').config(); // charger les variables d'environnement

const express = require('express'); // création de la base de l'application Express
app.set('trust proxy', 1);
const cookie = require('cookie-parser');
const cors = require('cors'); // importation du cors
require('./database'); // importe et exécute la connexion MongoDB

const app = express(); // création d'une instance d'Express

// Actification du cors avant les routes
app.use(cors({
  origin: ["http://localhost:5173", "https://react-projet-cookchef.onrender.com"],
  credentials: true,
methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
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