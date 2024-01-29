import React, { useState, useRef, useEffect } from "react";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import { useNavigate } from "react-router-dom";

const Menu = () => {
  const categories = {
    computers: ["all", "laptop", "desktop"],
    mobiles: ["all", "android", "tablet"],
  };
  const [activeCategory, setActiveCategory] = useState(null);
  const navigate = useNavigate();
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveCategory(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
  };

  const handleSubcategoryChange = (option, category) => {
    setActiveCategory(null);
    navigate(`/productlisting/${category}/${option.value}`);
  };

  return (
    <div className="Menu" ref={menuRef}>
      <div className="categories">
        {Object.keys(categories).map((category) => (
          <div
            key={category}
            className="menu-item"
            onClick={() => handleCategoryClick(category)}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
            {activeCategory === category && (
              <Dropdown
                options={categories[category]}
                placeholder="Select an option"
                className="dropdown-content text-base bg-slate-50"
                value={categories[category][0]}
                onChange={(option) => handleSubcategoryChange(option, category)}
                style={{ "z-index": "10" }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu;
