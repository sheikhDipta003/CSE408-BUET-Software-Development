import React, { useState, useRef, useEffect } from "react";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import "../css/Dropdown.css";
import { useNavigate } from "react-router-dom";

const Menu = () => {
  const categories = {
    computer: ["all", "laptop", "desktop"],
    accessories: ["all", "keyboard", "mouse"],
  };
  const [activeCategory, setActiveCategory] = useState(null);
  const [hoverSubcategory, setHoverSubcategory] = useState(null);
  const navigate = useNavigate();
  const menuRef = useRef(null);
  let categoryHoverTimeout;

  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (menuRef.current && !menuRef.current.contains(event.target)) {
  //       setActiveCategory(null);
  //     }
  //   };

  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, [menuRef]);

  const handleCategoryHover = (category) => {
    clearTimeout(categoryHoverTimeout);

    categoryHoverTimeout = setTimeout(() => {
      setActiveCategory(category);
    }, 300);
  };

  const handleCategoryLeave = () => {
    clearTimeout(categoryHoverTimeout);
    setActiveCategory(null);
    setHoverSubcategory(null);
  };

  const handleSubcategoryClick = (subcategory, category) => {
    setActiveCategory(null);
    navigate(`/productlisting/${category}/${subcategory}`);
  };

  return (
    <div className="Menu" ref={menuRef}>
      <div className="categories">
        {Object.keys(categories).map((category) => (
          <div
            key={category}
            className={`menu-item${activeCategory === category ? " active" : ""}`}
            onMouseEnter={() => handleCategoryHover(category)}
            onMouseLeave={handleCategoryLeave}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
            {activeCategory === category && (
              // <Dropdown
              //   options={categories[category]}
              //   placeholder="Select an option"
              //   className="dropdown-content text-base bg-slate-50"
              //   //value={categories[category][0]}
              //   onChange={(option) => handleSubcategoryChange(option, category)}
              //   style={{ "z-index": "10" }}
              // />
              <div className="subcategory-menu">
                {categories[category].map((subcategory) => (
                  <div
                    key={subcategory}
                    className={`subcategory-item${hoverSubcategory === subcategory ? " hover" : ""}`}
                    onClick={() =>
                      handleSubcategoryClick(subcategory, category)
                    }
                    onMouseEnter={() => setHoverSubcategory(subcategory)}
                    onMouseLeave={() => setHoverSubcategory(null)}
                  >
                    {subcategory.charAt(0).toUpperCase() + subcategory.slice(1)}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu;
