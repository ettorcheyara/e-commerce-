import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Card = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]); // initialiser le panier comme vide

  // Charger les données du panier
  useEffect(() => {
    const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
    if (!user || !user.id) {
      alert('Vous devez être connecté pour accéder au panier.');
      navigate('/login');
      return;
    }

    const url = `http://localhost:3000/api/panier/panier/${user.id}`;
    console.log("Fetching from URL:", url);

    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Erreur HTTP: ' + response.status);
        }
        return response.json();
      })
      .then(data => {
        if (data.articles) {
          setCart(data.articles.map(item => ({
            id: item.produitId ? item.produitId._id : undefined,  // Assurez-vous d'accéder correctement à l'ID
            name: item.nom,
            price: item.prix,
            quantity: item.quantite,
            pic: "../src/Pics/a.jpg"  // Assurez-vous que ce chemin est correct et accessible
          })));
        } else {
          setCart([]);
        }
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des données du panier:', error);
      });

  }, [navigate]);

  const removeFromCart = (productId) => {
    if (!productId) {
      console.error('Tentative de suppression d’un produit sans ID valide');
      return;
    }
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.id) return;

    fetch(`http://localhost:3000/api/panier/supprimer/${user.id}/${productId}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Erreur lors de la suppression du produit.');
        }
        return response.text();
      })
      .then(() => {
        setCart(prevCart => prevCart.filter(item => item.id !== productId));
        alert('Produit supprimé du panier.');
      })
      .catch(error => {
        console.error('Erreur lors de la suppression du produit:', error);
        alert(error.message);
      });
  };
  const updateQuantity = (productId, newQuantity) => {
    if (!productId) {
      console.error('Tentative de mise à jour de quantité pour un produit sans ID valide');
      return;
    }
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.id) return;

    fetch(`http://localhost:3000/api/panier/modifier/${user.id}/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nouvelleQuantite: newQuantity }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Erreur lors de la mise à jour de la quantité.');
        }
        return response.text();
      })
      .then(() => {
        setCart(prevCart => prevCart.map(item => item.id === productId ? { ...item, quantity: newQuantity } : item));
        alert('Quantité mise à jour.');
      })
      .catch(error => {
        console.error('Erreur lors de la mise à jour de la quantité:', error);
        alert(error.message);
      });
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("Votre panier est vide.");
      return;
    }
    navigate("/payment");
  };

  return (
    <div className="mx-8 mt-8">
      <h1 className="txt mb-10 text-xl font-bold">Mon Panier</h1>
      <div className="w-full flex md:flex-row flex-col gap-8 justify-start items-center">
        <div className="md:w-[75%] w-full">
          {cart.length === 0 && <div>Aucun produit dans le panier.</div>}
          {cart.map((item, index) => (
            <div key={index}>
              <div className="sm:grid w-full sm:justify-center my-1 sm:content-center sm:justify-items-center sm:items-center sm:grid-cols-5 flex flex-row justify-between items-center gap-2 bg-opacity-60 pr-2 rounded-xl">
                <img src={item.pic} alt="pic" className="sm:w-20 sm:h-20 h-16 w-16 sm:rounded-none rounded-s-xl object-cover" />
                <h1>{item.price} DA</h1>
                <div className="flex flex-row bg-gray-500 bg-opacity-60 gap-3 rounded-3xl items-center px-2 pt-1 pb-2">
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                  <h1>{item.quantity}</h1>
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                </div>
                <h1>{item.price * item.quantity}</h1>
                <button onClick={() => removeFromCart(item.id)} className="sm:inline-block hidden rounded-full bg-gray-500 bg-opacity-60 text-white px-[9px] py-[2px]">X</button>
              </div>
              <div className="bg-black h-[1px] my-2 w-full"></div>
            </div>
          ))}
        </div>

        {/* Résumé du panier */}
        <div className="md:w-[25%] w-full flex flex-col justify-start items-center ">
          <div className="bg-[#D9D9D9] flex flex-col justify-start items-center gap-5 my-6 p-4 w-full rounded-2xl">
            <h1 className="text-xl font-bold uppercase">Résumé du Panier</h1>
            <div className="bg-black h-[1px] my-2 w-full"></div>
            <div className="flex flex-row justify-between items-center w-full">
              <h1>Sous-total</h1>
              <h1>{cart.reduce((acc, item) => acc + item.price * item.quantity, 0)} DA</h1>
            </div>
          </div>
          <button onClick={handleCheckout} className="uppercase text-white w-full bg-black rounded-3xl py-4 ">
            Commander
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;
