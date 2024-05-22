const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schéma pour les articles dans le panier
const articlePanierSchema = new Schema({
    produitId: {
        type: Schema.Types.ObjectId,
        ref: 'Produit',
        required: true
    },
    nom: {
        type: String,
        required: true
    },
    prix: {
        type: Number,
        required: true
    },
    quantite: {
        type: Number,
        required: true,
        min: 1  // Assure que la quantité est au moins 1
    }
});

// Schéma principal du panier
const panierSchema = new Schema({
    clientId: {
        type: Schema.Types.ObjectId,
        ref: 'Client',
        required: true
    },
    articles: [articlePanierSchema], // Utilisation du schéma d'article défini ci-dessus
    dateCreation: {
        type: Date,
        default: Date.now
    },
    prixTotal: {
        type: Number,
        default: 0
    }
});

// Modèle Mongoose pour le Panier
const Panier = mongoose.model('Panier', panierSchema);

module.exports = Panier;

