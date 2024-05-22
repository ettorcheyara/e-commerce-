import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Mescommandes = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([
    {
      id: 1,
      name: "T-shirt",
      pic: "../src/Pics/a.jpg",
      price: 20,
      quantity: 1,
    },
    {
      id: 2,
      name: "Pantalon",
      pic: "../src/Pics/a.jpg",
      price: 30,
      quantity: 1,
    },
    {
      id: 3,
      name: "Chaussures",
      pic: "../src/Pics/a.jpg",
      price: 50,
      quantity: 1,
    },
  ]);

  return (
    <div className="mx-8 mt-8">
      <h1 className="txt mb-10 text-xl font-bold">Mes Commandes</h1>
     
        <div className="w-full">
          <div className="sm:grid hidden w-full sm:justify-center sm:content-center sm:justify-items-center sm:items-center sm:grid-cols-5">
            <h1 className="title">Produit</h1>
            <h1 className="title">Prix</h1>
            <h1 className="title">Quantité</h1>
            <h1 className="title">Total</h1>
           
          </div>
          <div className="bg-black h-[1px] my-2 w-full"></div>
          {cart.map((item) => (
            <div key={item.id}>
              <div className="sm:grid w-full sm:justify-center my-1 sm:content-center sm:justify-items-center sm:items-center sm:grid-cols-5
              flex flex-row justify-between items-center gap-2  bg-opacity-60 pr-2 rounded-xl">
                <img src={item.pic} alt="pic" className="sm:w-20 sm:h-20 h-16 w-16 sm:rounded-none rounded-s-xl object-cover" />
                <h1>{item.price} DA</h1>
                <div className="flex flex-row  bg-opacity-60 gap-3 rounded-3xl items-center px-2 pt-1 pb-2">
                <h1>{item.quantity}</h1>
                </div>
                <h1>{item.price * item.quantity} DA</h1>
                
              </div>
              <div className="bg-black h-[1px] my-2 w-full"></div>
            </div>
          ))}
        </div>
      </div>
   
  );
};

export default Mescommandes;