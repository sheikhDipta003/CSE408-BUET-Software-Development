import React, { useContext, useEffect, useState } from 'react';
import DataContext from '../context/DataContext';
import Slider from 'react-slick';
import '../css/ProductDetails.css';
import { useParams } from 'react-router-dom';

const ProductDetails = () => {
    const { products } = useContext(DataContext);
    const [comparisonData, setComparisonData] = useState([]);
    const { product_id } = useParams();

    useEffect(() => {
        if (products.items) {
            const productId = product_id;
            const details = [];

            products.items.forEach(item => {
                item.brands.forEach(brand => {
                    brand.platform_products.forEach(platform => {
                        platform.products_info.forEach(product => {
                            if (product.product_id === productId) {
                                details.push(product);
                            }
                        });
                    });
                });
            });

            // Group the details into pairs for the slides
            const groupedDetails = [];
            for (let i = 0; i < details.length; i += 2) {
                groupedDetails.push(details.slice(i, i + 2));
            }
            setComparisonData(groupedDetails);
        }
    }, [products, product_id]);

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 10
    };

    const renderSpecKeys = (products) => {
        const allSpecKeys = new Set();
        products.forEach(product => {
            Object.keys(product.specs).forEach(key => allSpecKeys.add(key));
        });
        return Array.from(allSpecKeys);
    };

    const renderSpecValue = (specValue) => {
        if (typeof specValue === 'object' && specValue !== null) {
            return Object.entries(specValue).map(([key, value]) => 
                <div key={key}>{`${key}: ${value}`}</div>
            );
        }
        return specValue;
    };

    return (
        <div className="product-details">
            <h2>Product Comparison</h2>
            <Slider {...settings}>
                {comparisonData.map((group, index) => (
                    <div key={index} className="slide">
                        <div className="specs-keys">
                            {renderSpecKeys(group).map((key, idx) => (
                                <div key={idx} className="spec-key">{key}</div>
                            ))}
                        </div>
                        {group.map((detail, idx) => (
                            <div key={idx} className="product-comparison">
                                <div className="product-header">
                                    <img src={detail.image} alt={detail.product_name} />
                                    <h3>{detail.product_name}</h3>
                                    <p>Price: {detail.price}</p>
                                    <p>Rating: {detail.rating}</p>
                                </div>
                                <div className="product-specs">
                                    {renderSpecKeys(group).map((key, idx) => (
                                        <div key={idx} className="spec-value">
                                            {renderSpecValue(detail.specs[key])}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default ProductDetails;
