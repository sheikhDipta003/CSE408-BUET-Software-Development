import React from 'react';
import { FaBookmark, FaTicketAlt } from 'react-icons/fa';
import '../css/ProductCard.css';

const ProductCard = ({ product }) => {
  const handleBookmarkClick = () => {
    // Handle bookmarking logic
  };

  const handleCouponClick = () => {
    // Handle viewing coupons logic
  };

  return (
    <div className="product-card" style={{"backgroundColor": "sandybrown"}}>
      <img src={product.image} alt={product.name} style={{"width":"100px"}}/>
      <div className="product-details">
        <h3>{product.name}</h3>
        <p>Price: {product.price}</p>
        <div className="icons">
          <FaBookmark onClick={handleBookmarkClick} className="bookmark-icon" />
          <FaTicketAlt onClick={handleCouponClick} className="coupon-icon" />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
