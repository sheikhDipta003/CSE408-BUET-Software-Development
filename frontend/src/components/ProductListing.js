import { useContext, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import '../css/ProductListing.css';
import api from '../api/products';
import DataContext from '../context/DataContext';
import ProductFilter from './ProductFilter';

const ProductListing = () => {
    const { category, subcategory } = useParams();
    const { products, setProducts } = useContext(DataContext);
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

    function extractAndCombineSpecs(productsData) {
        const specs = combinedSpecsRef.current;

        productsData.items.forEach(item => {
            item.brands.forEach(brand => {
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
            });
        });
    }

    useEffect(() => {
        if (products.items) {
            extractAndCombineSpecs(products);
            console.log("Combined Specs:", combinedSpecsRef.current);
        }
    }, [products]);

    return (
        <main className='ProductListing'>
            <h2 style={{color:"black"}}>List of {subcategory} in {category} category</h2>
            <p style={{ color:"black", marginTop: "1rem" }}>This is the page where all the products related to {subcategory} will be displayed.</p>
            <div className="content-container">
                {products.items && <ProductFilter specs={combinedSpecsRef.current} />}

                <div className="topBar">
                    <div className="brand-name">
                        Brand Name
                    </div>

                    <div className="select-boxes">
                        {/* Items per page selector */}
                        <label htmlFor="items-per-page">Show:</label>
                        <select id="items-per-page" className="items-per-page">
                            <option value="10">10</option>
                            <option value="20">20</option>
                            {/* More options */}
                        </select>

                        {/* Sort by selector */}
                        <label htmlFor="sort-by">Sort by:</label>
                        <select id="sort-by" className="sort-by">
                            <option value="priceLowToHigh">Price (Low to High)</option>
                            <option value="priceHighToLow">Price (High to Low)</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Rest of your component */}
        </main>
    );
};

export default ProductListing;
