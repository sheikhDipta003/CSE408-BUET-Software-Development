import React, { useState, useRef, useEffect } from 'react';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import { useNavigate } from 'react-router-dom';

const Menu = () => {
    const categories = {
        computers: ["Laptop", "Desktop", "PC"],
        mobiles: ["Android", "Tablet"],
        books: [],
        fashion: [],
        artsAndCrafts: [],
        sports: []
        // Add more categories and subcategories as needed
    };
    const [activeCategory, setActiveCategory] = useState(null);
    const navigate = useNavigate();
    const menuRef = useRef(null);

    useEffect(() => {
        // Event listener to handle clicks outside the menu
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setActiveCategory(null); // Close the dropdown if clicked outside
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [menuRef]);

    const handleCategoryClick = (category) => {
        setActiveCategory(category);
    };

    const handleSubcategoryChange = (option, category) => {
        setActiveCategory(null); // Close the dropdown upon selection
        navigate(`/productlisting/${category}/${option.value}`);
    };

    return (
        <div className="Menu" ref={menuRef}>
            <div className="categories">
                {Object.keys(categories).map(category => (
                    <div key={category} className="menu-item" onClick={() => handleCategoryClick(category)}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                        {activeCategory === category && (
                            <Dropdown 
                                options={categories[category]}
                                placeholder="Select an option"
                                className="dropdown-content"
                                value={categories[category][0]}
                                onChange={(option) => handleSubcategoryChange(option, category)}
                            />
                        )}
                    </div>
                ))}
                <div className="more">More...</div>
            </div>
        </div>
    );
};

export default Menu;
