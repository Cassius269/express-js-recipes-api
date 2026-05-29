// Importer le paquage mongoogse
const mongoose = require('mongoose');

// Se connecter à la base de données
mongoose.connect(process.env.MONGO_URI,{
    dbName: 'cookchef',
})
.then(() => {
    console.log('Connexion DB okay')
}).catch((e)=>{
    console.log('Connexion DB échoué', e.message)
})
