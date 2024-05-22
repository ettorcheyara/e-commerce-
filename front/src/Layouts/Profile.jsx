import { Link, useNavigate } from "react-router-dom";  // Combinez les importations de react-router-dom
import { useState, useRef, useEffect } from "react";
import { DownArrow } from "../public/Svgs";

const Profile = () => {
  const fileInputRef = useRef(null);
  const navigate = useNavigate(); // Hook pour naviguer
  const [ddmenu, setDdmenu] = useState(false);

  // Récupérer les informations de l'utilisateur stockées dans localStorage
  const [user, setUser] = useState({
    role: "",
    name: "",
    email: "",
    pic: "",
  });

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user")) || { nom: "", email: "", role: "" };
    setUser({
      role: userData.role,
      name: userData.nom,
      email: userData.email,
      pic: "../src/Pics/a.jpg"  // Image par défaut
    });
  }, []);
  const handleLogout = () => {
    localStorage.removeItem('user');  // Effacer les données de l'utilisateur de localStorage
    navigate('/login');  // Rediriger l'utilisateur vers la page de login
  };

  return (
    <div className="flex mx-5 flex-col med:flex-row w-calc(100% - 40px) justify-start gap-5 mt-10 items-center">
      <div
        style={ddmenu ? { height: '370px' } : { height: '300px' }}
        className="bg-[#D9D9D9] p-4 w-full med:w-[60%] flex flex-col justify-between items-center gap-2">
        <div className="flex flex-row gap-8 w-full items-center justify-start">
          <img
            className="object-cover h-20 w-20 rounded-full"
            src={user.pic}
            alt=""
          />
          <h1 className="text-2xl font-bold">{`${user.name} ${user.lastname}`}</h1>
        </div>
        <div className="flex flex-col gap-2 w-full">
          {user.role === "client" ? (
            <Link to="/Mescommandes" className="w-full">
              <div className="p-1 w-full hover:bg-white hover:bg-opacity-30 duration-200">
                <h1 className="title">Mes Commandes</h1>
              </div>
            </Link>
          ) : user.role === "seller" ? (
            <Link to="/gestion" className="w-full">
              <div className="p-1 w-full hover:bg-white hover:bg-opacity-30 duration-200">
                <h1 className="title">Gestion des produits</h1>
              </div>
            </Link>
          ) : null}
          {user.role === "seller" ? (
            <div className="w-full">
              <button
                className="flex flex-row w-full p-1 hover:bg-white hover:bg-opacity-30 duration-200 justify-between items-center"
                onClick={(e) => {
                  setDdmenu(!ddmenu);
                }}
              >
                <h1 className="title">Notifications</h1>
                <DownArrow />
              </button>
              {ddmenu && (
                <div className="flex flex-col justify-start items-start gap-1">
                  <Link
                    to="/commandes"
                    className="w-full px-1 hover:bg-white hover:bg-opacity-30 duration-200 no-underline"
                  >
                    commandes
                  </Link>
                  <Link
                    to="/acceptations"
                    className="w-full px-1 hover:bg-white hover:bg-opacity-30 duration-200 no-underline"
                  >
                    acceptations
                  </Link>
                  <Link
                    to="/commentaires"
                    className="w-full px-1 hover:bg-opacity-30  hover:bg-white duration-200 no-underline"
                  >
                    commentaires
                  </Link>
                  <Link
                    to="/reclamations"
                    className="w-full px-1 hover:bg-opacity-30  hover:bg-white duration-200 no-underline"
                  >
                    reclamations
                  </Link>
                </div>
              )}
            </div>
          ) : user.role === "admin" ? (
            <Link to="/admin/notifications" className="w-full">
              <div className="p-1 w-full hover:bg-white hover:bg-opacity-30 duration-200">
                <h1 className="title">Notifications</h1>
              </div>
            </Link>
          ) : null}
        </div>
        <button
          className="bg-black pt-1 pb-[6px] med:px-8 med:w-fit w-full rounded-3xl text-white font-semibold"
          onClick={handleLogout}
        >
          Se déconnecter
        </button>
      </div>
      <div className="flex w-full p-4 flex-col lil:flex-row h-fit gap-6 lil:gap-0 lil:h-[300px] justify-between bg-white items-center">
        <div className="flex flex-col justify-start items-start gap-10">
          <h1 className="txt uppercase">Profile de {user.role === "client" ? "Client" : user.role === "seller" ? "Vendeur" : "Admin"}</h1>
          <div className="flex flex-col mt-auto justify-start items-start gap-3">
            <div className="flex flex-row gap-4 items-center">
              <h1 className="title">Nom :</h1>
              <h1>{user.name}</h1>
            </div>
            <div className="flex flex-row gap-4 items-center">
              <h1 className="title">Prénom :</h1>
              <h1>{user.lastname}</h1>
            </div>
            <div className="flex flex-row gap-4 items-center">
              <h1 className="title">Email :</h1>
              <h1>{user.email}</h1>
            </div>
            <div className="flex flex-row gap-4 items-center">
              <h1 className="title">Date de naissance :</h1>
              <h1>{user.birthdate}</h1>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center items-center gap-2">
          <img
            src={user.pic}
            className="object-cover h-40 w-40 rounded-full"
            alt=""
          />
          <input
            type="file"
            hidden
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => {
              const file = e.target.files[0];
              setUser({ ...user, pic: URL.createObjectURL(file) });
            }}
            ref={fileInputRef}
          />
          <button
            type="none"
            className="text-black font-semibold bg-white shadow-md px-2 py-2 border-[1px]"
            onClick={() => fileInputRef.current.click()}
          >
            Modifier l'image
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;

