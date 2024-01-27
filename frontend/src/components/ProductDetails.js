import React, { useContext, useEffect, useState } from 'react';
import DataContext from '../context/DataContext';
import '../css/ProductDetails.css';
import { useParams, useHistory, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faBell, faTimes } from '@fortawesome/free-solid-svg-icons';
import { faTicketAlt } from '@fortawesome/free-solid-svg-icons';
import { faBookmark } from '@fortawesome/free-solid-svg-icons';
import CouponDetailsPopup from './CouponDetailsPopup';
import useAuth from '../hooks/useAuth';

const ProductDetails = () => {
    const { products } = useContext(DataContext);
    const [comparisonData, setComparisonData] = useState([]);
    const [headerData, setHeaderData] = useState([]);
    const {category, subcategory, product_id} = useParams();
    const [showCouponPopup, setShowCouponPopup] = useState(false);
    const [selectedCoupon, setSelectedCoupon] = useState(null);
    const [couponsCount, setCouponsCount] = useState(0);
    const [visibleStartIndex, setVisibleStartIndex] = useState(0);
    const [showSidebar, setShowSidebar] = useState(false);
    const [alertPrice, setAlertPrice] = useState('');
    const [isValidInput, setIsValidInput] = useState(false);
    const [inputError, setInputError] = useState('');
    const { auth } = useAuth();
    const navigate = useNavigate();

    const handleCreatePriceDropClick = () => {
        if (!auth?.accessToken) {
            navigate('/login');
        } else {
            console.log('Performing action for logged-in user');
        }
    };

    useEffect(() => {
        if (products.items) {
            const productId = product_id;
            const details = [];
            const headers = [];

            products.items.forEach(item => {
                item.brands.forEach(brand => {
                    brand.platform_products.forEach(platform => {
                        platform.products_info.forEach(product => {
                            if (product.product_id === productId) {
                                details.push(flattenSpecs(product.specs));
                                headers.push(product);

                                const coupons = product.coupon;
                                if (coupons && coupons.length > 0) {
                                    setCouponsCount(coupons.length);
                                }
                            }
                        });
                    });
                });
            });

            setComparisonData(details);
            setHeaderData(headers);
            // console.log(headers);
        }
    }, [products, product_id]);

    const flattenSpecs = (specs) => {
        const flattenedSpecs = {};

        const traverseSpecs = (obj, prefix = '') => {
            for (const key in obj) {
                const newKey = prefix ? `${prefix}.${key}` : key;
                if (typeof obj[key] === 'object' && obj[key] !== null) {
                    traverseSpecs(obj[key], newKey);
                } else {
                    flattenedSpecs[newKey] = obj[key];
                }
            }
        };

        traverseSpecs(specs);
        return flattenedSpecs;
    };

    const renderProductHeaders = () => {
        return headerData.slice(visibleStartIndex, visibleStartIndex + 2).map((product, index) => (
            <th key={index}>
                <div className="product-header relative">
                    {showCouponPopup && <CouponDetailsPopup coupon={selectedCoupon} onClose={() => setShowCouponPopup(false)} />}
                    
                    {/* Bookmark Icon with Tooltip */}
                    <div className="bookmark-icon relative hover:cursor-pointer" onClick={() => {/* Bookmark functionality here */}}>
                        <FontAwesomeIcon icon={faBookmark} />
                        <div className="tooltip absolute -top-0 left-3 whitespace-nowrap bg-black text-white text-xs h-6 rounded py-1 px-2 opacity-0 hover:opacity-100 z-20">
                            Bookmark this item
                        </div>
                    </div>
                    
                    {/* Price Alert Icon with Tooltip */}
                    <div className="ml-2 relative hover:cursor-pointer" onClick={openSidebar}>
                        <FontAwesomeIcon icon={faBell} />
                        <div className="tooltip absolute -top-0 left-3 whitespace-nowrap bg-black text-white text-xs h-6 rounded py-1 px-2 opacity-0 hover:opacity-100 z-20">
                            Set Price Drop Alert
                        </div>
                    </div>

                    <img src={product.image} alt={product.product_name} />
                    <div className='product-desc'>
                        <p>{
                            (product.product_name).length <= 25
                                ? product.product_name
                                : `${(product.product_name).slice(0, 25)}...`
                        }</p>
                        <p>Price: {product.price}</p>
                        <p>Rating: {product.rating}</p>
                        <a href={product.url} target="_blank" rel="noopener noreferrer">Shop Now</a>
                    </div>

                    {/* Coupon Icon with Tooltip */}
                    <div className="relative hover:cursor-pointer" onClick={() => handleCouponIconClick(product.coupon)}>
                        <FontAwesomeIcon icon={faTicketAlt} />
                        <div className="tooltip absolute -top-0 left-3 whitespace-nowrap bg-black text-white text-xs h-6 rounded py-1 px-2 opacity-0 hover:opacity-100 z-20">
                            See all coupons
                        </div>
                    </div>
                </div>
            </th>
        ));
    };

    const renderSpecKeys = () => {
        const allSpecKeys = new Set();
        comparisonData.forEach(product => {
            Object.keys(product).forEach(key => allSpecKeys.add(key));
        });
        return Array.from(allSpecKeys);
    };

    const handleCouponIconClick = (coupon) => {
        console.log('inside handleCouponIconClick');
        console.log('coupon=', coupon);
        setSelectedCoupon(coupon);
        setShowCouponPopup(true);
    };

    const slideRight = () => {
        if (visibleStartIndex < headerData.length - 2) {
            setVisibleStartIndex(visibleStartIndex + 1);
        }
    };

    const slideLeft = () => {
        if (visibleStartIndex > 0) {
            setVisibleStartIndex(visibleStartIndex - 1);
        }
    };

    const openSidebar = () => setShowSidebar(true);
    const closeSidebar = () => setShowSidebar(false);

    const handlePriceInputChange = (e) => {
        const value = e.target.value;
        setAlertPrice(Number(value));
        
        if (Number(value) > 0) {
            setIsValidInput(true);
            setInputError('');
        } else {
            setIsValidInput(false);
            setInputError('Please enter a positive integer');
        }
    };

    return (
        <div className="product-details">
            <h2>Product Comparison</h2>

            <div className='carousel'>
                <button className="arrow-button" onClick={slideLeft} disabled={visibleStartIndex===0}>
                    <FontAwesomeIcon icon={faArrowLeft} />
                </button>

                <div className="carousel-table">
                    <table className="comparison-table">
                        <thead>
                            <tr>
                                <th style={{textAlign: 'center'}}>Spec Name</th>
                                {renderProductHeaders()}
                            </tr>
                        </thead>
                        <tbody>
                            {renderSpecKeys().map((key, idx) => (
                                <tr key={idx} className={idx % 2 === 0 ? 'even' : 'odd'}>
                                    <td>{key}</td>
                                    {comparisonData.slice(visibleStartIndex, visibleStartIndex + 2).map((product, i) => (
                                        <td key={i}>{product[key]}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <button className="arrow-button" onClick={slideRight} disabled={visibleStartIndex === headerData.length-2}>
                    <FontAwesomeIcon icon={faArrowRight} />
                </button>
            </div>

            {/* Sidebar for Price Drop Alert */}
            {showSidebar && (
                    <div className={`sidebar fixed top-0 right-0 w-64 bg-white h-screen overflow-y-auto p-4 transform ${showSidebar ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out h-full shadow-lg z-50`}>
                    <div className="sidebar-header flex justify-end">
                        <button onClick={closeSidebar}>
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                    </div>
                    <div className="sidebar-content p-4">
                        <h2 className="text-lg font-semibold mb-4">Set Price Drop Alert</h2>
                        <p className="mb-4">Enter your desired price for the product and we'll notify you when it drops to or below this price.</p>
                        <input
                            type="number"
                            value={alertPrice}
                            onChange={handlePriceInputChange}
                            className="border-2 border-gray-300  rounded p-2 w-full"
                            placeholder="Enter your target price"
                        />
                        {inputError && <p className="text-red-500 text-sm mt-2">{inputError}</p>}
                    </div>

                    <div className="sidebar-footer flex justify-between mt-4 px-2">
                        <button className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded-l" onClick={closeSidebar}>
                            Cancel
                        </button>

                        <button className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r ${!isValidInput && 'opacity-50 cursor-not-allowed'}`} disabled={!isValidInput} onClick={handleCreatePriceDropClick}>
                            Create Alert
                        </button>
                    </div>

                    <div style={{"width":"95%", "height":"0.5vh","backgroundColor":"red", "marginTop":"20px", "marginBottom":"5px"}}></div>

                    <div className="price-history-section mt-4 text-center">
                        <h3 className="text-xl font-semibold">Price History</h3>
                    </div>

                </div>
            )}

        </div>
    );
};

export default ProductDetails;
