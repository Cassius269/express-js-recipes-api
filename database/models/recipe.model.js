const mongoose = require('mongoose');

const recipeSchema = mongoose.Schema({
    title: {type: String, unique: true},
    imageUrl: String,
    content: {type: String, maxlength: 1000},
    authorId:{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User' 
    },
    createdAt : {type: Date, default: Date.now},
    updatedAt: Date
});

const RecipeModel = mongoose.model('recipe', recipeSchema);

module.exports = RecipeModel;