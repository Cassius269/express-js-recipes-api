const UserModel = require('../../database/models/user.model');
const bcrypt = require('bcrypt'); // importer le package de hashage de mot de passe
const verifyToken  = require('./auth/verifyToken');

// Créer un router
const router = require('express').Router();

// Méthode de création de nouvel utilisateur sur la route "/api/users"
router.post('/', async (req, res) => {
    await verifyToken(req, res);

    try{
        // Déconstruire le payload
        const {password, ...otherInfos} = req.body;
        
        // Hasher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new UserModel(
            {   ...otherInfos, 
                password:hashedPassword
        });

        await newUser.save();

        if(newUser){
            // Exclure le mot et la version de l'objet de la réponse renvoyée par le serveur
            const { password: pwd, __v, ...userToReturn } = newUser.toObject();
            res.status(201).json(userToReturn)
        }

    }catch(error){
        if(error.code === 11000){
            res.status(400).json({message:'Email déjà utilisé'});
        }else {
            res.status(400).json({
            message: 'Oops une erreur à la création du nouvel utilisateur',
            error: error.message
        });
        }
        
    }
})

// Méthode de recupération des utilisateurs sur la route "/api/users"
router.get('/', async (req, res) => {
    await verifyToken(req, res);

    try {
        const users = await UserModel.find(); // récupérer tous les utiisateurs
        res.status(200).json(users)
    }catch(error){
        res.status(500).json({
            message: `Oops une erreur de récupération des utilisateurs`, 
            error : error.message
        })
    }
})

// Méthode de recupération d'un utilisateur par son Id  sur la route "/api/users/:id"
router.get('/:id', async (req, res) => {
    await verifyToken(req, res);

    try {
        const user = await UserModel.findById(req.params.id); // récupérer un utilisateur par son Id
         if(!user){
            res.status(404).json({message: 'Utilisateur non trouvé'});
         }else {
            res.status(200).json(user)
         }
    }catch(error){
        res.status(500).json({
            message: `Oops une erreur de récupération des utilisateurs`, 
            error : error.message
        })
    }
})

// Méthode de suppression d'un utilisateur sur la route "/api/users/:id"
router.delete('/:id', async (req, res) => {
    await verifyToken(req, res);

    try {   
        const user = await UserModel.findByIdAndDelete(req.params.id);
        
        if(!user){
            return res.status(404).json({message: 'Utilisateur non trouvé'});
        }else {
            res.status(200).json({message: 'Utilisateur supprimé avec succés'})
        }
        
    } catch (error) {
        res.status(500).json({
            message: 'Oops une erreur de suppression d\'utilisateur', 
            error: error.message
        }
        )
    }
})

router.put('/:id', async (req, res) => {
    await verifyToken(req, res);

    try {
        const { password, ...otherInfos } = req.body;
        let updateData = { ...otherInfos }; 

        if (password) {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(password, salt); 
        }

        const user = await UserModel.findByIdAndUpdate(
            req.params.id,
            updateData, 
            { new: true, runValidators: true }
        ).select('-password -__v');

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Erreur de mise à jour', error: error.message });
    }
});

module.exports = router;