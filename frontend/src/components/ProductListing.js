import { useContext, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../css/ProductListing.css';
import api from '../api/axios';
import DataContext from '../context/DataContext';
import ProductFilter from './ProductFilter';
import { useNavigate } from "react-router-dom";
import ReactPaginate from 'react-paginate';

const ProductListing = () => {
    const { category, subcategory } = useParams();
    const { products, fetchError, isLoading } = useContext(DataContext);
    const [productCards, setProductCards] = useState([]);
    const [sortType, setSortType] = useState('priceLowToHigh');
    const [selectedFilters, setSelectedFilters] = useState({});
    const [priceRange, setPriceRange] = useState({ lower: 0, upper: 400000 });
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(4);
    const navigate = useNavigate();

    const goToProductDetail = (productId) => {
        navigate(`/productlisting/${category}/${subcategory}/${productId}`);
    };

    const combinedSpecsRef = useRef({
        websites:[],
        brands:[],
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
                        if(item.category === category.toLowerCase() && (item.subcategory === subcategory.toLowerCase() || subcategory.toLowerCase() === "all") ){
                            if (!specs["brands"].includes(brand.brand_name)) {
                                specs["brands"].push(brand.brand_name);
                            }
                            brand.platform_products.forEach(platform => {
                                if (!specs["websites"].includes(platform.website_name)) {
                                    specs["websites"].push(platform.website_name);
                                }
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
        for (const specKey in selectedFilters) {
            const selectedOptions = selectedFilters[specKey];
            for (const specCategory in product.specs) {
                if (product.specs[specCategory].hasOwnProperty(specKey)) {
                    if (selectedOptions.length > 0 && !selectedOptions.includes(product.specs[specCategory][specKey])) {
                        return false;
                    }
                }
            }
        }

        return true;
    };

    useEffect(() => {
        let tempProductCards = [];
        let selectedBrands = selectedFilters["brands"] || [];
        let selectedWebsites = selectedFilters["websites"] || [];

        products?.items?.forEach(item => {
            item.brands.forEach(brand => {
                if(item.category === category.toLowerCase() && (item.subcategory === subcategory.toLowerCase() || subcategory.toLowerCase() === "all") ){
                    brand.platform_products.forEach(platform => {
                        platform.products_info.forEach(product => {
                            if (filterProducts(product) && 
                                (selectedBrands.length === 0 || selectedBrands.includes(brand.brand_name)) && 
                                (selectedWebsites.length === 0 || selectedWebsites.includes(platform.website_name))
                            ) {
                                tempProductCards.push(
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

        switch (sortType) {
            case 'priceLowToHigh':
                tempProductCards.sort((a, b) => a.props.price - b.props.price);
                break;
            case 'priceHighToLow':
                tempProductCards.sort((a, b) => b.props.price - a.props.price);
                break;
            case 'topRated':
                tempProductCards.sort((a, b) => b.props.rating - a.props.rating);
                break;
            default:
                // default case is already sorted
        }

        setProductCards(tempProductCards);
    }, [products, sortType, selectedFilters, priceRange, category, subcategory]);

    const handleSortChange = (e) => {
        setSortType(e.target.value);
    };

    const handleFilterChange = (filters) => {
        setSelectedFilters(filters);
    };

    const handlePriceRangeChange = (range) => {
        setPriceRange(range);
    };

    const handlePageClick = (event) => {
        setCurrentPage(event.selected);
    };

    const generateItemsPerPageOptions = () => {
        const options = [];
        for (let i = 4; i <= productCards.length; i += 4) {
            options.push(i);
        }
        // Add an option for 'all' if the last option isn't exactly the total number of products
        if (options[options.length - 1] !== productCards.length) {
            options.push('all');
        }
        return options;
    };

    const handleItemsPerPageChange = (e) => {
        const value = e.target.value;
        setItemsPerPage(value === 'all' ? productCards.length : Number(value));
        setCurrentPage(0);
    };

    const pageCount = itemsPerPage === 'all' ? 1 : Math.ceil(productCards.length / itemsPerPage);
    const currentItems = itemsPerPage === 'all' ? productCards : productCards.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

    return (
        <main className='ProductListing'>
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
                            {
                                Math.min((currentPage * itemsPerPage) + 1, productCards.length) === Math.min((currentPage + 1) * itemsPerPage, productCards.length) ?
                                <p>
                                    Showing {Math.min((currentPage * itemsPerPage) + 1, productCards.length)} results for "{category}/{subcategory}"
                                </p> : 
                                <p>
                                    Showing {itemsPerPage === 'all' ? productCards.length : Math.min((currentPage * itemsPerPage) + 1, productCards.length)} - {itemsPerPage === 'all' ? productCards.length : Math.min((currentPage + 1) * itemsPerPage, productCards.length)} of {productCards.length} results for "{category}/{subcategory}"
                                </p>
                            }
                        </div>

                        <div className="select-boxes">
                            <label htmlFor="items-per-page">Show:</label>
                            <select id="items-per-page" className="items-per-page border-2 border-black rounded-sm" onChange={handleItemsPerPageChange}>
                                {generateItemsPerPageOptions().map((option) => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>

                            <label htmlFor="sort-by">Sort by:</label>
                            <select id="sort-by" className="sort-by border-2 border-black rounded-sm" onChange={handleSortChange}>
                                <option value="priceLowToHigh">Price (Low to High)</option>
                                <option value="priceHighToLow">Price (High to Low)</option>
                                <option value="topRated">Top Rated</option>
                            </select>
                        </div>
                    </div>

                    <div className="main-content">
                        {isLoading && <p className="statusMsg text-green-500">Loading products...</p>}
                        {!isLoading && fetchError && <p className="statusMsg" style={{ color: "red" }}>{fetchError}</p>}
                        {!isLoading && !fetchError && (currentItems.length ? currentItems : <p className="statusMsg">No products to display.</p>)}
                    </div>

                    <ReactPaginate
                        previousLabel={"Previous"}
                        nextLabel={"Next"}
                        pageCount={pageCount}
                        onPageChange={handlePageClick}
                        containerClassName={"pagination flex justify-center items-center my-4"}
                        pageClassName={"page mx-1"}
                        pageLinkClassName={"page-link block border border-gray-300 rounded py-2 px-3 hover:bg-gray-100 cursor-pointer"}
                        previousClassName={"previous mx-1"}
                        previousLinkClassName={"previous-link block border border-gray-300 rounded py-2 px-3 hover:bg-gray-100 cursor-pointer"}
                        nextClassName={"next mx-1"}
                        nextLinkClassName={"next-link block border border-gray-300 rounded py-2 px-3 hover:bg-gray-100 cursor-pointer"}
                        activeClassName={"active bg-blue-500 text-white"}
                        disabledClassName={"disabled opacity-50 cursor-not-allowed"}
                    />
                </div>
            </div>
        </main>
    );
};

export default ProductListing;
