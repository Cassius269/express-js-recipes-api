const verifyToken = async (req,res) => {
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
}

export default verifyToken();