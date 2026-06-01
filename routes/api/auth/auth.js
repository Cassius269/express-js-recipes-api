const UserModel = require('../../../database/models/user.model');
const bcrypt = require('bcrypt')
const router = require('express').Router();
const jsonwebtoken = require('jsonwebtoken');
const {key, keyPub} = require('../keys');


router.post('/auth', async (req, res) => {
    const {email, password} = req.body;

    try {
        const user = await UserModel.findOne({email}).exec();

        if(!user){
           return res.status(404).json({message: "Identifiants invalides"})
        }

        if(user){
            if(bcrypt.compareSync(password, user.password)){
                const token = jsonwebtoken.sign({}, key, {
                    subject: user._id.toString(), // id de l'utilisateur connecté
                    expiresIn: 3600 * 24 * 30 *6, // token valable 6 mois
                    algorithm:'RS256'
                });

                res.cookie('token', token, {
                    httpOnly: true,  
                    sameSite: 'none',
                    secure: true,
                    partitioned: true                
                }); // persister le token dans les cookies
               
               const { password: pwd, __v, ...userToReturn } = user.toObject();
                return res.json(userToReturn);     
            }else {
                res.status(400).json({message: 'Identifiants invalides'})
            }
        }
    } catch (error) {
        res.status(400).json({message: 'Identifiants invalides'})
    }
})

router.get('/me', async (req, res) => {  
console.log("COOKIE:", req.cookies);
    res.set('Cache-Control', 'no-store');
    const { token } = req.cookies;
    console.log('token', token)
    if (!token) {
        return res.json(null);
    }

    try {
        const decodedToken = jsonwebtoken.verify(token, keyPub, {algorithms: ['RS256']});
        const currentUser = await UserModel.findById(decodedToken.sub).exec(); // chercher l'tutilisateur à l'aide de son ID
        console.log('decoded token', decodedToken)
    console.log(currentUser)
        if (!currentUser) {
        return res.json(null);
        }

    const { password, __v, ...userToReturn } = currentUser.toObject();
    return res.json(userToReturn);
  } catch (error) {
        console.error(error);
    return res.json(null);
  }
});

router.delete('/logout', (req,res) => {
    res.clearCookie('token',{
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        partitioned: true,
    });
    // res.end();

    return res.status(200).json({
        message: "Logged out",
    });
});

module.exports = router;