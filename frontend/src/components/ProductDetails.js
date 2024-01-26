import React, { useContext, useEffect, useState } from 'react';
import DataContext from '../context/DataContext';
import '../css/ProductDetails.css';
import { useParams, useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { faTicketAlt } from '@fortawesome/free-solid-svg-icons';
import { faBookmark } from '@fortawesome/free-solid-svg-icons';
import CouponDetailsPopup from './CouponDetailsPopup';

const ProductDetails = () => {
    const { products } = useContext(DataContext);
    const [comparisonData, setComparisonData] = useState([]);
    const [headerData, setHeaderData] = useState([]);
    const {category, subcategory, product_id} = useParams();
    const [showCouponPopup, setShowCouponPopup] = useState(false);
    const [selectedCoupon, setSelectedCoupon] = useState(null);
    const [couponsCount, setCouponsCount] = useState(0);
    const [visibleStartIndex, setVisibleStartIndex] = useState(0);

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
                <div className="product-header">
                    {showCouponPopup && <CouponDetailsPopup coupon={selectedCoupon} onClose={() => setShowCouponPopup(false)} />}
                    <div className="bookmark-icon">
                        <FontAwesomeIcon icon={faBookmark} />
                    </div>
                    <img src={product.image} alt={product.product_name} />
                    <div className='product-desc'>
                        <p>{
                            (product.product_name).length <= 25
                                ? product.product_name
                                : `${(product.product_name).slice(0, 25)}...`
                        }</p>
                        <p>Price: {product.price}{renderCouponIcon(product)}</p>
                        <p>Rating: {product.rating}</p>
                        <a href={product.url} target="_blank" rel="noopener noreferrer">Shop Now</a>
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

    const renderCouponIcon = (product) => {
        // console.log(product.coupon.length);
        if (product.coupon) {
            return (
                <p className="coupon-icon" onClick={() => handleCouponIconClick(product.coupon)}>
                    <FontAwesomeIcon icon={faTicketAlt} />
                </p>
            );
        }
        return null;
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
        </div>
    );
};

export default ProductDetails;
