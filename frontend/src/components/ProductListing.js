import { useContext, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../css/ProductListing.css';
import api from '../api/products';
import DataContext from '../context/DataContext';
import ProductFilter from './ProductFilter';
import { useNavigate } from "react-router-dom";

const ProductListing = () => {
    const { category, subcategory } = useParams();
    const { products, fetchError, isLoading } = useContext(DataContext);
    const [productCards, setProductCards] = useState([]);
    const [sortType, setSortType] = useState('priceLowToHigh');
    const [selectedFilters, setSelectedFilters] = useState({});
    const [priceRange, setPriceRange] = useState({ lower: 0, upper: 400000 });
    const navigate = useNavigate();

    const goToProductDetail = (productId) => {
        navigate(`/productlisting/${category}/${subcategory}/${productId}`);
    };

    const combinedSpecsRef = useRef({
        ProcessorBrand: [],
        ProcessorModel: [],
        ProcessorFrequency: [],
        ProcessorCore: [],
        ProcessorThread: [],
        CPUCache: [],
        DisplaySize: [],
        DisplayType: [],
        DisplayResolution: [],
        TouchScreen: [],
        RAM: [],
        RAMType: [],
        BusSpeed: []
    });


    useEffect(() => {
        const extractAndCombineSpecs = async (productsData) => {
            try {
                const specs = combinedSpecsRef.current;
        
                productsData.items.forEach(item => {
                    item.brands.forEach(brand => {
                        if(item.category === category.toLowerCase() && item.subcategory === subcategory.toLowerCase()){
                            brand.platform_products.forEach(platform => {
                                platform.products_info.forEach(product => {
                                    const productSpecs = product.specs;
                                    for (const specKey in productSpecs) {
                                        for (const detailKey in productSpecs[specKey]) {
                                            if (!specs[detailKey].includes(productSpecs[specKey][detailKey])) {
                                                specs[detailKey].push(productSpecs[specKey][detailKey]);
                                            }
                                        }
                                    }
                                });
                            });
                        }
                    });
                });
        
            } catch (err) {
                console.log(`Error: ${err.message}`);
            }
        }

        if (products?.items) {
            extractAndCombineSpecs(products);
        }
    }, [products, category, subcategory]);

    const filterProducts = (product) => {
        // Price Range Filter
        if (product.price < priceRange.lower || product.price > priceRange.upper) {
            return false;
        }

        // Checkbox Filters
        // console.log("selectedFilters = ", selectedFilters);
        for (const specKey in selectedFilters) {
            const selectedOptions = selectedFilters[specKey];
            // console.log("product.specs[specKey] = ", product.specs[specKey]);
            if (selectedOptions.length > 0 && !selectedOptions.includes(product.specs[specKey])) {
                return false;
            }
        }

        return true;
    };

    // Function to extract product info from JSON
    const getProductCards = () => {
        let productCards = [];
        products?.items?.forEach(item => {
            item.brands.forEach(brand => {
                if(item.category === category.toLowerCase() && item.subcategory === subcategory.toLowerCase()){
                    brand.platform_products.forEach(platform => {
                        platform.products_info.forEach(product => {
                            if (filterProducts(product)) {
                                productCards.push(
                                    <div className="product-card" onClick={() => goToProductDetail(product.product_id)} key={product.id} price={product.price} rating={product.rating} brand={brand.brand_name}>
                                        <img src={product.image} alt={product.name} />
                                        <h3>{product.product_name}</h3>
                                        <p>{product.price}</p>
                                        <p>{product.rating}</p>
                                    </div>
                                );
                            }
                        });
                    });
                }
            });
        });
        return productCards;
    };

    const handleSortChange = (e) => {
        setSortType(e.target.value);
    };

    const sortedProducts = () => {
        let productCards = getProductCards();

        switch (sortType) {
            case 'priceLowToHigh':
                return productCards.sort((a, b) => a.props.price - b.props.price);
            case 'priceHighToLow':
                return productCards.sort((a, b) => b.props.price - a.props.price);
            case 'topRated':
                return productCards.sort((a, b) => b.props.rating - a.props.rating);
            case 'brandName':
                return productCards.sort((a, b) => (a.props.brand_name  || "").localeCompare(b.props.brand_name || ""));
            default:
                return productCards;
        }
    };

    const handleFilterChange = (filters) => {
        setSelectedFilters(filters);
    };

    const handlePriceRangeChange = (range) => {
        setPriceRange(range);
    };

    return (
        <main className='ProductListing'>
            <h2 style={{color:"black"}}>List of {subcategory} in {category} category</h2>
            <p style={{ color:"black", marginTop: "1rem" }}>This is the page where all the products related to {subcategory} will be displayed.</p>

            <div className="content-container">
                {products?.items && 
                <ProductFilter 
                    specs={combinedSpecsRef.current} 
                    onFilterChange={handleFilterChange} 
                    onPriceRangeChange={handlePriceRangeChange}
                />}

                <div className="content">
                    <div className="topBar">
                        <div className="results-count">
                            Showing 12 results for "{subcategory}"
                        </div>

                        <div className="select-boxes">
                            <label htmlFor="items-per-page">Show:</label>
                            <select id="items-per-page" className="items-per-page">
                                <option value="4">4</option>
                                <option value="8">8</option>
                                <option value="12">12</option>
                            </select>

                            <label htmlFor="sort-by">Sort by:</label>
                            <select id="sort-by" className="sort-by" onChange={handleSortChange}>
                                <option value="priceLowToHigh">Price (Low to High)</option>
                                <option value="priceHighToLow">Price (High to Low)</option>
                                <option value="topRated">Top Rated</option>
                                <option value="brandName">Brand Name</option>
                            </select>
                        </div>
                    </div>

                    <div className="main-content">
                        {isLoading && <p className="statusMsg">Loading products...</p>}
                        {!isLoading && fetchError && <p className="statusMsg" style={{ color: "red" }}>{fetchError}</p>}
                        {!isLoading && !fetchError && (sortedProducts().length ? sortedProducts() : <p className="statusMsg">No products to display.</p>)}
                    </div>
                </div>
            </div>
        </main>
    );
};

export default ProductListing;
