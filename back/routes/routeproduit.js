const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const Product = require("../models/produit");

// Configure multer storage for handling multiple files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../images'));
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

// Initialize multer with the updated storage configuration
const upload = multer({ storage: storage });

// Ajouter un nouveau produit
router.post("/add", upload.array("images", 4), async (req, res) => {
  try {
    const images = req.files.map((file) => file.filename);
    console.log(req.body);
    let temp = {
      nom: req.body.nom,
      description: req.body.description,
      prix: req.body.prix,
      promo: req.body.promo === "oui" ? true : false,
      prixPromo: req.body.promo === "oui" ? req.body.prixPromo : null,
      stock: req.body.stock,
      quantiteRestante: req.body.stock,
      pourcentageAchat: 0,
      couleurs: [req.body.couleurs],
      tailles:
        req.body.categorie === "vetements"
          ? JSON.parse(req.body.tailles)
          : req.body.categorie === "chaussures"
            ? JSON.parse(req.body.tailles)
            : null,
      categorie: req.body.categorie,
      sousCategorie:
        req.body.categorie === "vetements" ||
          req.body.categorie === "chaussures"
          ? req.body.sousCategorie
          : null,
      categorieCustom: "null",
      images: images,
      vendeurId: req.body.vendeurId,
    };
    const newProduct = new Product(temp);
    const savedProduct = await newProduct.save();
    res
      .status(201)
      .send({
        product: savedProduct,
        message: "Produit ajouté avec succès.",
        ok: true,
      });
  } catch (error) {
    res.status(400).send({ message: error.message, ok: false });
  }
});

// Supprimer un produit
router.delete("/delete/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).send({ message: "Produit non trouvé.", ok: false });
    }
    res.status(200).send({ message: "Produit supprimé avec succès.", ok: true });
  } catch (error) {
    res.status(500).send({ message: error.message, ok: false });
  }
});

// Mettre à jour les informations d'un produit
router.put("/update/:id", async (req, res) => {
  try {
    const updates = req.body;
    const product = await Product.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    });
    if (!product) {
      return res.status(404).send({ message: "Produit non trouvé.", ok: false });
    }
    res.status(200).send({ product: product, message: "produit mise a jour successfully", ok: true });
  } catch (error) {
    res.status(400).send({
      message: error.message,
      ok: false
    });
  }
});

// Mettre un produit en promotion
router.put("/promote/:id", async (req, res) => {
  try {
    const { promo, prixPromo } = req.body;
    if (!promo || prixPromo === undefined) {
      return res.status(400).send("Les données de promotion sont incomplètes.");
    }
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        promo: promo,
        prixPromo: prixPromo,
      },
      { new: true }
    );

    if (!product) {
      return res.status(404).send("Produit non trouvé.");
    }
    res.status(200).send(product);
  } catch (error) {
    res.status(400).send(error.message);
  }
});



//get all product where user_id = userid
router.get('/userproducts/:user_id', async (req, res) => {
  const user_id = req.params.user_id;
  try {
    const products = await Product.find({
      vendeurId: user_id
    })
    if (products) {
      res.status(200).send({
        products: products,
        ok: true
      })
    } else {
      res.status(400).send({ message: "aucune produits !", ok: false })
    }

  } catch (err) {
    res.status(400).send({
      message: err.message,
      ok: false
    })
  }



})// Activer ou désactiver l'affichage d'un produit sur la page d'accueil
router.put('/accueil/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Mise à jour du produit pour définir `afficherSurAccueil` à true
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { afficherSurAccueil: true },
      { new: true }  // Option pour retourner le document modifié
    );

    if (!updatedProduct) {
      return res.status(404).send({ message: "Produit non trouvé", ok: false });
    }

    res.status(200).send({
      message: "Produit mis à jour avec succès pour être affiché sur l'accueil",
      product: updatedProduct,
      ok: true
    });
  } catch (error) {
    res.status(500).send({ message: error.message, ok: false });
  }
});



// Récupérer tous les produits
router.get('/allproducts', async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).send({ products, ok: true, message: "Tous les produits ont été récupérés avec succès." });
  } catch (error) {
    res.status(500).send({ message: "Erreur lors de la récupération des produits", error: error });
  }
});
// Dans votre fichier routes pour les produits, par exemple productRoutes.js
router.get('/popular', async (req, res) => {
  try {
    const products = await Product.find({ afficherSurAccueil: true });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des produits populaires", error });
  }
});
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }
    res.json(product);
  } catch (error) {
    console.error('Erreur lors de la récupération du produit:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});




module.exports = router;
