const RecipeModel = require('../../database/models/recipe.model');
const verifyToken  = require('./auth/verifyToken');

// Créer un router
const router = require('express').Router();

// Méthode de création de nouvel utilisateur sur la route "/api/recipes"
router.post('/', async (req, res) => {
    await verifyToken(req, res);

    try{
        const newUser = new RecipeModel(req.body);
        await newUser.save();

        if(newUser){
            // Exclure le mot et la version de l'objet de la réponse renvoyée par le serveur
            const {  __v, ...recipeToReturn } = newUser.toObject();
            res.status(201).json(recipeToReturn)
        }

    }catch(error){
        if(error.code === 11000){
            res.status(400).json({message:'Titre déjà déjà utilisé'});
        }else {
            res.status(400).json({
            message: 'Oops une erreur à la création de nouvelle recette',
            error: error.message
        });
        }
        
    }
})

// Méthode de recupération des recettes sur la route "/api/recipes"
router.get('/', async (req, res) => {
    await verifyToken(req, res);

    try {
        const users = await RecipeModel.find(); // récupérer tous les utiisateurs
        res.status(200).json(users)
    }catch(error){
        res.status(500).json({
            message: `Oops une erreur de récupération des recettes`, 
            error : error.message
        })
    }
})

// Méthode de recupération d'une recette par son Id  sur la route "/api/recipes/:id"
router.get('/:id', async (req, res) => {
    await verifyToken(req, res);

    try {
        const recipe = await RecipeModel.findById(req.params.id); // récupérer une recette par son Id
         if(!recipe){
            res.status(404).json({message: 'Recette non trouvé'});
         }else {
            res.status(200).json(recipe)
         }
    }catch(error){
        res.status(500).json({
            message: `Oops une erreur de récupération de la recette`, 
            error : error.message
        })
    }
})

// Méthode de suppression d'une recette sur la route "/api/users/:id"
router.delete('/:id', async (req, res) => {
    await verifyToken(req, res);

    try {   
        const recipe = await RecipeModel.findByIdAndDelete(req.params.id);
        
        if(!recipe){
            return res.status(404).json({message: 'Recette non trouvée'});
        }else {
            res.status(200).json({message: 'Recette supprimée avec succés'})
        }
        
    } catch (error) {
        res.status(500).json({
            message: 'Oops une erreur de suppression d\'une recette', 
            error: error.message
        }
        )
    }
})

router.patch('/:id', async (req, res) => {
    await verifyToken(req, res);

    try {
        const { createdAt, ...otherInfos } = req.body;
        let updateData = {updatedAt: Date.now(), ...otherInfos }; 

        const recipe = await RecipeModel.findByIdAndUpdate(
            req.params.id,
            updateData, 
            { new: true, runValidators: true, versionKey: true  }
        ).select('__v');

        if (!recipe) {
            return res.status(404).json({ message: 'Recette non trouvé' });
        }

        res.status(200).json(recipe);
    } catch (error) {
        res.status(500).json({ message: 'Erreur de mise à jour', error: error.message });
    }
});

module.exports = router;