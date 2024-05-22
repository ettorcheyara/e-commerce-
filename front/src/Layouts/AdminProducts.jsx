import React, { useEffect, useState } from 'react';
import ReactStars from "react-stars";
import { ShopIcon, FavIcon } from "../public/Svgs";
import ProductCard from '/src/Layouts/ProductCard';  // Assurez-vous d'ajuster le chemin d'import selon votre structure de fichiers


const AdminProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/produits/allproducts');
      const data = await response.json();
      setProducts(data.products);
    } catch (error) {
      console.error("Erreur lors du chargement des produits", error);
    }
  };

  const updateVisibility = async (id, newVisibility) => {
    if (!id) {
      console.error("L'ID du produit est undefined.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/produits/accueil/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ afficherSurAccueil: newVisibility })
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour de la visibilité du produit");
      }

      fetchProducts(); // Recharger les produits pour mettre à jour l'interface utilisateur
    } catch (error) {
      console.error("Erreur de mise à jour de la visibilité", error);
    }
  };

  const deleteProduct = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
      try {
        await fetch(`http://localhost:3000/api/produits/delete/${id}`, { method: 'DELETE' });
        setProducts(prev => prev.filter(p => p.id !== id)); // Mettre à jour l'état après suppression
      } catch (error) {
        console.error("Échec de la suppression du produit", error);
      }
    }
  };

  return (
    <div className="mx-8 my-8 relative w-full">
      <h1 className="title">Tous les produits :</h1>
      <div className="grid w-full my-2 gap-4 md:grid-cols-5 sm:grid-cols-3 justify-between items-center overflow-scroll">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            onUpdateVisibility={updateVisibility}
            onDelete={deleteProduct}
          />
        ))}
      </div>
    </div>
  );
};

export default AdminProducts;