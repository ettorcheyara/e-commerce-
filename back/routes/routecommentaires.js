const express = require("express");
const router = express.Router();
const Comment = require("../models/commentaire");  // Ajusté pour utiliser le bon modèle
const Product = require("../models/produit");
const Vendeur = require("../models/vendeur");

// Ajout de commentaires
router.post('/comments', (req, res) => {
    const newComment = new Comment({
        idproduit: req.body.product_id, // Changé pour correspondre au schéma
        clientid: req.body.user_id, // Changé pour correspondre au schéma
        commentaire: req.body.comment // Changé pour correspondre au schéma
    });
    newComment.save()
        .then(comment => res.status(201).send(comment))
        .catch(err => res.status(400).send(err));
});

// Mise à jour de commentaires
router.put('/comments/:id', (req, res) => {
    const { id } = req.params;
    const { comment } = req.body;

    Comment.findById(id)
        .then(foundComment => {
            if (!foundComment) {
                return res.status(404).send({ message: 'Commentaire non trouvé' });
            }
            foundComment.commentaire = comment; // Changé pour correspondre au schéma
            return foundComment.save();
        })
        .then(updatedComment => res.status(200).send(updatedComment))
        .catch(err => res.status(400).send(err));
});

// Suppression de commentaires
router.delete('/comments/:id', (req, res) => {
    const { id } = req.params;

    Comment.findById(id)
        .then(foundComment => {
            if (!foundComment) {
                return res.status(404).send({ message: 'Commentaire non trouvé' });
            }
            return foundComment.remove();
        })
        .then(() => res.status(204).send({ message: 'Commentaire supprimé' }))
        .catch(err => res.status(400).send(err));
});

// Obtenir tous les commentaires pour les produits d'un vendeur
router.get('/comments/vendor/:vendorId', async (req, res) => {
    const { vendorId } = req.params;

    try {
        const products = await Product.find({ vendeurId: vendorId });
        const productIds = products.map(product => product._id);

        const comments = await Comment.find({ idproduit: { $in: productIds } }); // Changé pour correspondre au schéma

        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des commentaires", error: error });
    }
});

module.exports = router;
