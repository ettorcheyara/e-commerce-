const express = require('express');
const router = express.Router();
const Panier = require('../models/panier')// Assurez-vous que le chemin est correct
const Produit = require('../models/produit'); // Assurez-vous que le chemin est correct
const Client = require('../models/client');  // Ajustez le chemin selon votre configuration


router.get('/panier/:clientId', async (req, res) => {
    const { clientId } = req.params;

    try {
        // Rechercher le panier par l'ID du client
        const panier = await Panier.findOne({ clientId }).populate({
            path: 'articles.produitId',
            select: 'nom prix' // Choisir de peupler uniquement le nom et le prix du produit
        });

        if (!panier) {
            return res.status(404).json({ message: "Panier non trouvé" });
        }

        // Réponse avec les articles du panier
        res.json({
            clientId: clientId,
            articles: panier.articles,
            prixTotal: panier.prixTotal
        });
    } catch (error) {
        console.error('Erreur lors de la récupération du panier:', error);
        res.status(500).json({ message: "Erreur serveur lors de la récupération du panier", error: error.message });
    }
});
router.delete('/vider/:clientId', async (req, res) => {
    const { clientId } = req.params;
    try {
        const panier = await Panier.findOne({ clientId: clientId });
        if (panier) {
            // Mettre à jour le panier en supprimant tous les articles
            panier.articles = []; // Supprimer tous les articles du panier
            panier.prixTotal = 0; // Réinitialiser le prix total
            await panier.save();
            res.send('Tous les produits ont été supprimés du panier.');
        } else {
            res.status(404).send('Panier non trouvé.');
        }
    } catch (error) {
        console.error('Erreur lors de la suppression des produits du panier:', error);
        res.status(500).send('Erreur serveur lors de la suppression des produits du panier.');
    }
});
router.post('/ajouter/:clientId/:produitId', async (req, res) => {
    const { clientId, produitId } = req.params;
    if (!isValidObjectId(clientId) || !isValidObjectId(produitId)) {
        return res.status(400).json({ message: "Identifiant invalide" });
    }
    const { quantite } = req.body;

    try {
        // Rechercher le produit pour obtenir le nom et le prix
        const produit = await Produit.findById(produitId);
        if (!produit) {
            return res.status(404).json({ message: "Produit non trouvé" });
        }

        // Vérifier la quantité
        if (quantite <= 0) {
            return res.status(400).json({ message: "Quantité invalide" });
        }

        // Rechercher le panier du client ou en créer un nouveau s'il n'existe pas
        let panier = await Panier.findOne({ clientId });
        if (!panier) {
            panier = new Panier({
                clientId,
                articles: [],
                prixTotal: 0
            });
        }

        // Vérifier si le produit est déjà dans le panier
        const indexProduit = panier.articles.findIndex(item => item.produitId.equals(produitId));
        if (indexProduit !== -1) {
            // Si le produit est déjà présent, mettre à jour la quantité
            panier.articles[indexProduit].quantite += quantite;
        } else {
            // Sinon, ajouter le nouveau produit dans le panier
            panier.articles.push({
                produitId: produit._id,
                nom: produit.nom,
                prix: produit.prix,
                quantite: quantite
            });
        }

        // Mise à jour du prix total du panier
        panier.prixTotal = panier.articles.reduce((acc, curr) => acc + (curr.prix * curr.quantite), 0);

        // Sauvegarder les modifications du panier
        await panier.save();

        res.json({ message: "Produit ajouté au panier", panier });
    } catch (error) {
        console.error('Erreur lors de l’ajout du produit au panier:', error);
        res.status(500).json({ message: "Erreur serveur lors de l'ajout du produit au panier", error: error.message });
    }
});

router.delete('/supprimer/:clientId/:produitId', async (req, res) => {
    const { clientId, produitId } = req.params;

    try {
        const panier = await Panier.findOne({ clientId: clientId });
        if (!panier) {
            return res.status(404).send('Panier non trouvé.');
        }

        // Filtrer les articles pour ne garder que ceux dont l'ID du produit est différent
        panier.articles = panier.articles.filter(item => item.produitId.toString() !== produitId);
        await panier.save();
        res.send('Produit supprimé du panier.');
    } catch (error) {
        console.error('Erreur lors de la suppression du produit du panier:', error);
        res.status(500).send('Erreur lors de la suppression du produit du panier.');
    }
});
router.put('/modifier/:clientId/:produitId', async (req, res) => {
    const { clientId, produitId } = req.params;
    const { nouvelleQuantite } = req.body;

    try {
        const panier = await Panier.findOne({ clientId: clientId });
        if (!panier) {
            return res.status(404).send('Panier non trouvé.');
        }

        const indexProduit = panier.articles.findIndex(item => item.produitId.toString() === produitId);
        if (indexProduit === -1) {
            return res.status(404).send('Produit non trouvé dans le panier.');
        }
        // Mise à jour de la quantité pour le produit trouvé
        panier.articles[indexProduit].quantite = nouvelleQuantite;
        await panier.save();
        res.send('Quantité mise à jour.');
    } catch (error) {
        console.error('Erreur lors de la modification de la quantité du produit:', error);
        res.status(500).send('Erreur lors de la modification de la quantité du produit.');
    }
});
const { isValidObjectId } = require('mongoose');

module.exports = router;
