import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DataContext from '../context/DataContext';
import '../css/Wishlist.css';

const Wishlist = () => {
  const categories = {
    computers: ["Laptop", "Desktop"],
    mobiles: ["Android", "Tablet"],
    books: [],
    fashion: [],
    artsAndCrafts: [],
    sports: []
  };
  
  const brands = ["HP", "Asus", "Dell"];

  const websites = ["Startech", "Ryans", "Daraz"];

    const wishlistItems = [{
      "product_id": "p979",
      "product_name": "HP 15 Laptop, Intel Celeron X941",
      "website_name": "Startech",
      "category":"computers",
      "subcategory":"laptop",
      "brand":"HP",
      "currrent_price": 275774,
      "date_added": "2023-03-19",
      "product_image": "https://m.media-amazon.com/images/W/MEDIAX_792452-T2/images/I/71OyrTkxpGL._AC_SL1500_.jpg"
    }, {
      "product_id": "p356",
      "product_name": "HP 16 Laptop, Intel Celeron L064",
      "website_name": "Startech",
      "category":"computers",
      "subcategory":"laptop",
      "brand":"HP",
      "currrent_price": 42467,
      "date_added": "2022-11-05",
      "product_image": "https://m.media-amazon.com/images/W/MEDIAX_792452-T2/images/I/71OyrTkxpGL._AC_SL1500_.jpg"
    }, {
      "product_id": "p482",
      "product_name": "HP 16 Laptop, Intel Celeron M085",
      "website_name": "Ryans",
      "category":"computers",
      "subcategory":"laptop",
      "brand":"HP",
      "currrent_price": 242773,
      "date_added": "2023-03-16",
      "product_image": "https://m.media-amazon.com/images/W/MEDIAX_792452-T2/images/I/51KupiNLuHL._AC_SL1280_.jpg"
    }, {
      "product_id": "p716",
      "product_name": "HP 11 Laptop, Intel Celeron V665",
      "website_name": "Ryans",
      "category":"computers",
      "subcategory":"laptop",
      "brand":"HP",
      "currrent_price": 357010,
      "date_added": "2022-08-16",
      "product_image": "https://m.media-amazon.com/images/W/MEDIAX_792452-T2/images/I/51KupiNLuHL._AC_SL1280_.jpg"
    }, {
      "product_id": "p152",
      "product_name": "HP 11 Laptop, Intel Celeron W025",
      "website_name": "Daraz",
      "category":"computers",
      "subcategory":"laptop",
      "brand":"HP",
      "currrent_price": 264211,
      "date_added": "2022-07-19",
      "product_image": "https://m.media-amazon.com/images/W/MEDIAX_792452-T2/images/I/71OyrTkxpGL._AC_SL1500_.jpg"
    }, {
      "product_id": "p400",
      "product_name": "HP 11 Laptop, Intel Celeron I927",
      "website_name": "Ryans",
      "category":"computers",
      "subcategory":"laptop",
      "brand":"HP",
      "currrent_price": 338670,
      "date_added": "2023-04-29",
      "product_image": "https://m.media-amazon.com/images/W/MEDIAX_792452-T2/images/I/51KupiNLuHL._AC_SL1280_.jpg"
    }, {
      "product_id": "p624",
      "product_name": "HP 15 Laptop, Intel Celeron R812",
      "website_name": "Startech",
      "category":"computers",
      "subcategory":"laptop",
      "brand":"HP",
      "currrent_price": 93647,
      "date_added": "2023-02-07",
      "product_image": "https://m.media-amazon.com/images/W/MEDIAX_792452-T2/images/I/51KupiNLuHL._AC_SL1280_.jpg"
    }, {
      "product_id": "p488",
      "product_name": "HP 10 Laptop, Intel Celeron B835",
      "website_name": "Startech",
      "category":"computers",
      "subcategory":"laptop",
      "brand":"HP",
      "currrent_price": 255692,
      "date_added": "2024-01-03",
      "product_image": "https://m.media-amazon.com/images/W/MEDIAX_792452-T2/images/I/51KupiNLuHL._AC_SL1280_.jpg"
    }, {
      "product_id": "p076",
      "product_name": "HP 17 Laptop, Intel Celeron I617",
      "website_name": "Startech",
      "category":"computers",
      "subcategory":"laptop",
      "brand":"HP",
      "currrent_price": 47485,
      "date_added": "2022-09-09",
      "product_image": "https://m.media-amazon.com/images/W/MEDIAX_792452-T2/images/I/71OyrTkxpGL._AC_SL1500_.jpg"
    }, {
      "product_id": "p922",
      "product_name": "HP 13 Laptop, Intel Celeron Y926",
      "website_name": "Startech",
      "category":"computers",
      "subcategory":"laptop",
      "brand":"HP",
      "currrent_price": 235805,
      "date_added": "2022-06-13",
      "product_image": "https://m.media-amazon.com/images/W/MEDIAX_792452-T2/images/I/51KupiNLuHL._AC_SL1280_.jpg"
    }];

    const [sortOption, setSortOption] = useState('');
    const [filters, setFilters] = useState({
        category: '',
        subcategory: '',
        brand: '',
        website: ''
    });

    const [products, setProducts] = useState(wishlistItems);
    const [filteredProducts, setFilteredProducts] = useState(wishlistItems);
    const [selectedProducts, setSelectedProducts] = useState(new Set());
    const [displayedProducts, setDisplayedProducts] = useState(wishlistItems);

    const handleSelectProduct = (productId) => {
        const newSelection = new Set(selectedProducts);
        if (newSelection.has(productId)) {
            newSelection.delete(productId);
        } else {
            newSelection.add(productId);
        }
        setSelectedProducts(newSelection);
    };

    const handleSelectAll = () => {
        if (selectedProducts.size === products.length) {
            setSelectedProducts(new Set());
        } else {
            setSelectedProducts(new Set(products.map(product => product.product_id)));
        }
    };

    const handleDeleteSelected = () => {
      const newProducts = products.filter(product => !selectedProducts.has(product.product_id));
      setProducts(newProducts);
      setDisplayedProducts(newProducts); // Update displayed products as well
      setSelectedProducts(new Set()); // Clear selection
  };

    useEffect(() => {
      applyFilters();
    }, [filters, sortOption]);
  
    const applyFilters = () => {
        let filtered = products.filter(item => {
            return (filters.category ? item.category.toLowerCase() === filters.category.toLowerCase() : true) &&
                  (filters.subcategory ? item.subcategory.toLowerCase() === filters.subcategory.toLowerCase() : true) &&
                  (filters.brand ? item.brand.toLowerCase() === filters.brand.toLowerCase() : true) &&
                  (filters.website ? item.website_name.toLowerCase().includes(filters.website.toLowerCase()) : true);
        });
        
        setFilteredProducts(filtered);
        applySort(filtered);
        setDisplayedProducts(filtered);
    };

    const applySort = (list) => {
        let sorted = [...list];
        if (sortOption === 'priceLowHigh') {
            sorted.sort((a, b) => a.currrent_price - b.currrent_price);
        } else if (sortOption === 'priceHighLow') {
            sorted.sort((a, b) => b.currrent_price - a.currrent_price);
        }
        setFilteredProducts(sorted);
    };
  
    const handleFilterChange = (e) => {
      setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleSortChange = (e) => {
      setSortOption(e.target.value);
      applySort(filteredProducts);
    };

    return (
        <div className="wishlist-wrapper">
            <div className="filters">
                <div>
                    <label>Category:</label>
                    <select name="category" onChange={handleFilterChange} className="border-2 border-black rounded-sm">
                        <option value="">All</option>
                        {Object.keys(categories).map((cat, index) => (
                            <option key={index} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Subcategory:</label>
                    <select name="subcategory" onChange={handleFilterChange} className="border-2 border-black rounded-sm">
                        <option value="">All</option>
                        {filters.category && categories[filters.category].map((sub, index) => (
                            <option key={index} value={sub}>{sub}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Brand:</label>
                    <select name="brand" onChange={handleFilterChange} className="border-2 border-black rounded-sm">
                        <option value="">All</option>
                        {filters.subcategory && brands.map((brand, index) => (
                            <option key={index} value={brand}>{brand}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Website:</label>
                    <select name="website" onChange={handleFilterChange} className="border-2 border-black rounded-sm">
                        <option value="">All</option>
                        {websites.map((site, index) => (
                            <option key={index} value={site}>{site}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="sorting-and-products-container">
              <div className="sorting-container">
                <label htmlFor="sort-by">Sort By: </label>
                <select id="sort-by" value={sortOption} onChange={handleSortChange} className="border-2 border-black rounded-sm">
                  <option value="">None</option>
                  <option value="priceLowHigh">Price (Low -{'>'} High)</option>
                  <option value="priceHighLow">Price (High -{'>'} Low)</option>
                </select>

                <button onClick={handleSelectAll}>
                    {selectedProducts.size === products.length ? 'Deselect All' : 'Select All'}
                </button>
                <button onClick={handleDeleteSelected}>Delete</button>
              </div>
            </div>
            
            <div className="wishlist-container">
                {displayedProducts.map((item, index) => (
                    <div key={index} className="wishlist-item">
                        <input
                            type="checkbox"
                            checked={selectedProducts.has(item.product_id)}
                            onChange={() => handleSelectProduct(item.product_id)}
                        />
                        <img src={item.product_image} alt={item.product_name} />
                        <div className="item-details">
                            <h3>{item.product_name}</h3>
                            <p>Price: {item.currrent_price}</p>
                            <p>Added on: {item.date_added}</p>
                            <p>Website: {item.website_name}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Wishlist;
