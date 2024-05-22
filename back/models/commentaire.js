const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    idproduit: mongoose.Schema.Types.ObjectId, // ID du produit commenté
    clientid: mongoose.Schema.Types.ObjectId, // ID de l'utilisateur qui a fait le commentaire
    commentaire: String, // Contenu du commentaire
    timestamp: { type: Date, default: Date.now } // Horodatage du commentaire
});

const Comment = mongoose.model('Comment', CommentSchema);
module.exports = Comment;
