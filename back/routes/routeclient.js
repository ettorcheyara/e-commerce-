const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Client = require('../models/client');
const Panier = require('../models/panier');
const Utilisateur = require('../models/utilisateur')

router.post('/clients', async (req, res) => {
    console.log(req.body);
    try {
        const clientData = req.body;

        // Générer un sel et hacher le mot de passe
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(clientData.motDePasse, salt);

        // Créer un nouveau client
        const nouveauClient = new Client({
            ...clientData,
            motDePasse: hashedPassword,
        });
        const clientSauvegarde = await nouveauClient.save();

        // Créer un nouvel utilisateur associé
        const nouvelUtilisateur = new Utilisateur({
            nom: clientSauvegarde.nom,
            email: clientSauvegarde.email,
            role: 'client',
            motDePasse: hashedPassword,  // Utiliser le mot de passe haché
        });
        await nouvelUtilisateur.save();
        console.log("Client ID:", clientSauvegarde._id);
        if (!clientSauvegarde._id) {
            throw new Error("L'ID du client n'est pas défini.");
        }

        const nouveauPanier = new Panier({
            clientId: clientSauvegarde._id,
            articles: [],
            prixTotal: 0
        });
        const panierSauvegarde = await nouveauPanier.save();

        // Mettre à jour le client avec l'ID du panier (si votre modèle le permet)
        clientSauvegarde.panierId = panierSauvegarde._id;
        await clientSauvegarde.save();

        // Retourner la réponse avec les informations du client (et éventuellement du panier)
        res.status(201).send({
            client: clientSauvegarde,
            panier: panierSauvegarde
        });
        console.log("Client ID:", clientSauvegarde._id); // Ceci devrait montrer un ObjectId valide
    } catch (error) {
        console.log(error);
        res.status(400).send({ error: error.message });
    }
});


// Supprimer tous les clients
router.delete('/client', async (req, res) => {
    try {
        const result = await Client.deleteMany({});
        res.status(200).send({ message: "Tous les utilisateurs ont été supprimés.", deletedCount: result.deletedCount });
    } catch (error) {
        res.status(500).send({ message: "Erreur lors de la suppression des utilisateurs.", error: error.toString() });
    }
});

// Récupérer tous les clients
router.get('/client', async (req, res) => {
    try {
        const clients = await Client.find({});
        res.status(200).send(clients);
    } catch (error) {
        res.status(500).send({ message: "Erreur lors de la récupération des utilisateurs.", error: error.toString() });
    }
});

module.exports = router;
const { isValidObjectId } = require('mongoose');
