const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    firstname: String, 
    lastname: String, 
    email: {type: String, unique: true},
    password: String
});

const UserModel = mongoose.model('User', userSchema); // mongose va générer une collection users au pluriel

module.exports = UserModel;