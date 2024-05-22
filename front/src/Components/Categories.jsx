import { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFemale, faMale, faBlender, faLaptop } from "@fortawesome/free-solid-svg-icons";

const Categories = () => {
  const [activeCategory, setActiveCategory] = useState(null);
  const categories = [
    { id: 1, name: "Femme", icon: faFemale },
    { id: 2, name: "Homme", icon: faMale },
    { id: 3, name: "Electroménager", icon: faBlender },
    { id: 4, name: "Électroniques", icon: faLaptop },
  ];

  const handleCategoryClick = (categoryId) => {
    setActiveCategory(categoryId);
  };

  return (
    <div className="mt-2 mb-1 flex flex-col items-center">
      <div className="flex gap-4 mt-2 justify-center">
        {categories.map((category) => (
          <Link
            to={`/category/${category.id}`}
            key={category.id}
            className={`px-4 py-2 rounded-md cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-110 ${activeCategory === category.id
                ? "bg-gray-400 bg-opacity-20 text-gray-800 shadow-md"
                : "hover:bg-gray-400 hover:bg-opacity-20"
              }`}
            onClick={() => handleCategoryClick(category.id)}
          >
            <div className="flex items-center gap-2 group">
              <FontAwesomeIcon
                icon={category.icon}
                className={`transition-transform duration-300 ease-in-out transform group-hover:rotate-12 group-hover:scale-125 ${activeCategory === category.id ? "text-black-500" : "text-black"
                  }`}
              />
              <span
                className={`transition-colors duration-300 ease-in-out ${activeCategory === category.id ? "text-black-500" : "text-black"
                  }`}
              >
                {category.name}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Categories;