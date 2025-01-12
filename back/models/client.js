const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clientSchema = new Schema({
    nom: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    motDePasse: { type: String, required: true },
    panierId: { type: Schema.Types.ObjectId, ref: 'Panier' },
    adresseLivraison: [{
        rue: String,
        ville: String,
        wilaya: String,
        commune: String,
        codePostal: String,
        pays: String,
    }],
    historiqueCommandes: [{
        commandeId: { type: Schema.Types.ObjectId, ref: 'Commande' },
        date: Date,
        total: Number,
        status: String,
    }],
    dateCreationCompte: { type: Date, default: Date.now }
});




module.exports = mongoose.model('Client', clientSchema);
