import React from 'react';

const ProductCard = ({ product, onUpdateVisibility, onDelete }) => {
    // Fonction pour obtenir l'URL de l'image
    const getImageUrl = (imageName) => {
        return `http://localhost:3000/images/${imageName}`;
    };

    return (
        <div className="w-full relative">
            <button onClick={() => onDelete(product._id)} className="absolute top-0 right-0 w-6 h-6 bg-opacity-20 rounded-tr-sm rounded-bl-sm bg-black shadow-md">
                Supprimer
            </button>
            <button onClick={() => onUpdateVisibility(product._id, !product.afficherSurAccueil)} className="absolute top-0 left-0 w-6 h-6 bg-opacity-20 rounded-tl-sm rounded-br-sm bg-black shadow-md">
                {product.afficherSurAccueil ? "Cacher" : "Afficher"}
            </button>
            <div className="flex w-full pb-2 flex-col bg-white shadow-md border-y-[1px] rounded-sm gap-2">
                <img className="bg-cover w-full h-40 rounded-sm" src={getImageUrl(product.images[0])} alt={product.nom} />
                <div className="flex flex-row mx-3 my-3 justify-between items-center">
                    <h1 className="text-base">{product.nom}</h1>
                    <h1 className="title">{product.prix} DA</h1>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
