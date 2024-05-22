
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Client = require('../models/client');
const Utilisateur = require('../models/utilisateur');
const jwt = require('jsonwebtoken');
router.get('/utilisateurs', async (req, res) => {
    try {
        const utilisateurs = await Utilisateur.find({});
        res.status(200).send(utilisateurs);
    } catch (error) {
        res.status(500).send({ message: "Erreur lors de la récupération des utilisateurs", error: error });
    }
})
router.post('/utilisateurs', async (req, res) => {
    try {
        const { motDePasse } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(motDePasse, salt);
        const nouvelUtilisateur = new Utilisateur({
            ...req.body,
            motDePasse: hashedPassword
        });
        const utilisateurSauvegarde = await nouvelUtilisateur.save();
        res.status(201).send(utilisateurSauvegarde);
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
});
router.delete('/utilisateurs', async (req, res) => {
    try {
        const result = await Utilisateur.deleteMany({});
        res.status(200).send({ message: "Tous les utilisateurs ont été supprimés", deletedCount: result.deletedCount });
    } catch (error) {
        res.status(500).send({ message: "Erreur lors de la suppression des utilisateurs", error: error });
    }
});

router.post('/login', async (req, res) => {
    const { email, motDePasse } = req.body;

    try {
        const utilisateur = await Utilisateur.findOne({ email });
        if (!utilisateur) {
            return res.status(400).send({ message: "Identifiants incorrects", ok: false });
        }

        const match = await bcrypt.compare(motDePasse, utilisateur.motDePasse);
        if (!match) {
            return res.status(400).send({ message: "Identifiants incorrects", ok: false });
        }

        let client = null;
        if (utilisateur.role === 'client') {
            client = await Client.findOne({ email: utilisateur.email });
            if (!client) {
                console.log("Aucun profil client trouvé pour cet utilisateur");
                return res.status(400).send({ message: "Profil client non trouvé", ok: false });
            }
        }

        const token = jwt.sign(
            { id: utilisateur._id, email: utilisateur.email, role: utilisateur.role },
            'your_secret_key',
            { expiresIn: '24h' }
        );

        res.send({
            token: token,
            ok: true,
            user: {
                id: client ? client._id : utilisateur._id,
                nom: utilisateur.nom,
                email: utilisateur.email,
                role: utilisateur.role
            },
            redirect: utilisateur.role === 'admin' ? '/admin' : '/'
        });
    } catch (error) {
        console.error("Error during login", error);
        res.status(500).send({ message: "Erreur du serveur lors de la connexion", error });
    }
});




module.exports = router;
