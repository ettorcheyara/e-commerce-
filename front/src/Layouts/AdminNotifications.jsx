import { useState, useEffect } from 'react';

const AdminNotifications = () => {
  const [vendeurs, setVendeurs] = useState([]);

  useEffect(() => {
    fetchVendeursNonApprouves();
  }, []);

  const fetchVendeursNonApprouves = () => {
    fetch('http://localhost:3000/api/getvendeurs')
      .then(response => response.json())
      .then(data => {
        console.log("Données reçues:", data);  // Log pour débogage
        setVendeurs(data);
      })
      .catch(error => console.error('Erreur lors de la récupération des vendeurs', error));
  };

  const approuverVendeur = (id, email) => {
    fetch(`http://localhost:3000/api/vendeurs/approuver/${id}/${email}`, { method: 'PATCH' })
      .then(response => response.json())
      .then(() => {
        alert('Vendeur approuvé');
        fetchVendeursNonApprouves();  // Rafraîchir la liste après l'action
      })
      .catch(error => alert('Erreur lors de l\'approbation du vendeur : ' + error));
  };

  const refuserVendeur = (id) => {
    fetch(`http://localhost:3000/api/vendeurs/refuser/${id}`, { method: 'DELETE' })
      .then(response => response.json())
      .then(() => {
        alert('Vendeur refusé');
        fetchVendeursNonApprouves();  // Rafraîchir la liste après l'action
      })
      .catch(error => alert('Erreur lors du refus du vendeur : ' + error));
  };

  return (
    <div className="mx-5 my-8 w-full">
      {vendeurs.length === 0 ? (
        <h1>Aucun vendeur non approuvé</h1>
      ) : (
        <div>
          {vendeurs.map((vendeur) => (
            <div key={vendeur._id} className="flex flex-col sm:flex-row my-3 px-2 shadow-md bg-white border rounded-xl gap-8 items-center justify-between">
              <div>
                <h1 className="text-xl font-bold">{`${vendeur.nomSociete}`}</h1>
                <p className="text-md">{`Email: ${vendeur.email}`}</p>
              </div>
              <div>
                <button onClick={() => approuverVendeur(vendeur._id, vendeur.email)} className="bg-green-500 text-white p-2 rounded-md">
                  Approuver
                </button>
                <button onClick={() => refuserVendeur(vendeur._id)} className="bg-red-500 text-white p-2 rounded-md ml-2">
                  Refuser
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminNotifications;
