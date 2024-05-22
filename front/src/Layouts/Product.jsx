import { useParams } from "react-router-dom";
import ReactStars from "react-stars";
import { useState, useEffect } from "react";

const Product = () => {
  const { id } = useParams();
  const [comment, setComment] = useState('');
  const [reviews, setReviews] = useState([]);
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/produits/${id}`);
        if (!response.ok) {
          throw new Error('Erreur HTTP: ' + response.status);
        }
        const data = await response.json();
        setProduct(data);
        setReviews(data.reviews || []);
      } catch (error) {
        console.error('Erreur lors de la récupération du produit', error);
      }
    };
    fetchProduct();
  }, [id]);

  const addToCart = async () => {
    const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
    if (!user || !user.id) {
      alert('Vous devez être connecté pour ajouter des produits au panier.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/panier/ajouter/${user.id}/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantite: quantity })
      });

      const data = await response.json(); // Si la réponse est maintenant correctement un JSON
      if (!response.ok) {
        throw new Error('Échec de l\'ajout au panier: ' + data.message);
      }
      alert(data.message);  // Afficher le message de succès depuis la réponse JSON
    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier:', error);
      alert('Erreur lors de l\'ajout au panier: ' + error.message);
    }
  };

  if (!product) {
    return <p>Chargement du produit...</p>;
  }

  const getImageUrl = (imageName) => {
    return `http://localhost:3000/images/${imageName}`;
  };
  return (
    <div className="mx-8 mt-8 w-[100% - 32px] flex md:flex-row flex-col gap-8 items-start justify-start bg-white p-4 shadow-lg border-y-[1px]">
      <div className="w-full flex flex-col gap-2 justify-start items-start">
        {product.images && product.images.length > 0 && (
          <div className="w-full gg:h-[470px] h-[300px] grid grid-cols-2 gg:grid-cols-3 gg:grid-rows-3 gap-4 justify-start items-center">
            {product.images.map((image, index) => (
              <img key={index} src={getImageUrl(image)} className={index === 1 ? "gg:col-span-2 w-full h-full object-cover gg:row-span-3" : "h-full w-full object-cover"} alt={product.nom} />
            ))}
          </div>
        )}
        <div className="w-full flex mt-3 flex-col gap-2">
          <h1 className="txt text-center">Avis des Clients</h1>
          <div className="h-[1px] bg-black w-full"></div>
          <div className="flex flex-col gap-2 items-start justify-start">
            {reviews.map((review) => (
              <div key={review.review_id} className="flex gap-[5px] shadow-md w-full p-2 rounded-md items-start bg-gray-400 bg-opacity-10">
                <img src={review.pic} className="w-[50px] h-[50px] rounded-full object-cover" alt="" />
                <div className="flex flex-col px-1">
                  <h1 className="title uppercase">{`${review.nom} ${review.prenom}`}</h1>
                  <p className="text-sm text-[#474747]">{review.review}</p>
                </div>
              </div>
            ))}
          </div>
          <input type="text" className="inputt" placeholder="Ajouter un commentaire" value={comment} onChange={(e) => setComment(e.target.value)} />
          <button onClick={() => {
            setReviews([...reviews, {
              review_id: reviews.length + 1,
              costumer_id: 1,
              nom: "name",
              prenom: "prenom",
              pic: "../src/Pics/a.jpg",
              review: comment,
            }]);
            setComment('');
          }} className="bg-black text-white pt-1 pb-2 rounded-lg text-lg w-full uppercase">Poster</button>
        </div>
      </div>

      <div className="w-full justify-between h-[550px] items-start flex flex-col gap-16 mt-8">
        <div className="w-full flex flex-col gap-8">
          <h1 className="text-xl font-semibold uppercase text-wrap">{product.nom}</h1>
          <div className="flex items-center justify-start gap-2">
            <ReactStars count={5} size={20} color2={"#ffd700"} edit={false} value={product.rating} />
            <p>{`(${product.reviews})`}</p>
          </div>
          <h1 className="text-xl font-semibold">{product.prix} DA</h1>
          <p className="text-sm">{product.description}</p>
        </div>
        <div className="w-full flex flex-col gap-4">
          <h1 className="text-lg uppercase font-semibold">Options disponibles</h1>
          <div className="flex gap-4">
            {product.taille && product.taille.length > 0 && product.taille.map((taille, index) => (
              <div key={index} className="bg-gray-200 pt-1 pb-2 px-[10px] border-[1px] border-black border-opacity-50">{taille}</div>
            ))}
          </div>
        </div>
        <div className="w-full flex gap-8 items-center">
          <div className="flex flex-row bg-gray-500 bg-opacity-60 gap-4 rounded-3xl items-center px-4 h-8">
            <button onClick={() => setQuantity(quantity + 1)} className="title">+</button>
            <h1>{quantity}</h1>
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="title">-</button>
          </div>
          <button onClick={addToCart} className="uppercase text-white w-[300px] bg-black rounded-3xl py-4">Ajouter au panier</button>
        </div>
        <div>
          Avez-vous une réclamation concernant le produit ? <a href="/reclamation">Cliquez ici.</a>
        </div>
      </div>
    </div>
  );
};

export default Product;
