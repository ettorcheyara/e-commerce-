import React, { useEffect, useState } from 'react';
import ReactStars from "react-stars";
import { ShopIcon } from "../public/Svgs";
import { Link } from "react-router-dom";
import { User } from "../public/Helpers";

const PopularProducts = () => {
  const user = User;
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchPopularProducts();
  }, []);

  const fetchPopularProducts = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/produits/popular');
      if (!response.ok) {
        throw new Error('Erreur HTTP: ' + response.status);
      }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Erreur lors du chargement des produits populaires", error);
    }
  };

  const getImageUrl = (imageName) => {
    return `http://localhost:3000/images/${imageName}`;
  };

  return (
    <div className="mx-5 w-calc(100% - 32px)">
      <h1 className="text-xl font-bold">Produits Populaires :</h1>
      <div className="grid w-full my-2 gap-4 md:grid-cols-5 sm:grid-cols-3 justify-center justify-items-center items-center overflow-scroll">
        {user?.role === 3 && (
          <Link to="/admin/products" className="flex w-full h-full pb-2 flex-col hover:cursor-pointer justify-center items-center bg-white shadow-md border-y-[1px] rounded-sm">
            <div className="rounded-full bg-slate-400 px-2 pt-1 pb-[6px] text-white font-semibold">+</div>
          </Link>
        )}
        {products.map((product, index) => (
          <Link key={index} className="w-full" to={`/product/${product._id}`}>
            <div className="flex w-full pb-2 flex-col bg-white shadow-md border-y-[1px] rounded-sm gap-2">
              <img className="bg-cover w-full h-50 rounded-sm" src={getImageUrl(product.images[0])} alt={product.nom} />
              <div className="flex flex-row my-3 mx-3 justify-between items-center">
                <h1 className="text-base">{product.nom}</h1>
                <h1 className="title">{product.prix} DA</h1>
              </div>
              <div className="flex flex-row mx-2 justify-between items-center">
                <ReactStars count={5} size={20} color2={"#ffd700"} edit={false} value={product.rating} />
                <ShopIcon />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PopularProducts;
