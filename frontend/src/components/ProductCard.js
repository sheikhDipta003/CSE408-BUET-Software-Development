import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTicketAlt } from '@fortawesome/free-solid-svg-icons';
import { faBookmark } from '@fortawesome/free-solid-svg-icons';
import '../css/ProductCard.css';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const handleBookmarkClick = () => {
    console.log('Bookmarking this item for logged-in user');
    navigate('/user/1/wishlist');
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
          <div className="bookmark-icon relative hover:cursor-pointer" onClick={(e) => {handleBookmarkClick();}}>
              <FontAwesomeIcon icon={faBookmark} />
              <div className="tooltip absolute -top-0 -left-3 whitespace-nowrap bg-black text-white text-xs h-6 rounded py-1 px-2 opacity-0 hover:opacity-100 z-20">
                  Bookmark this item
              </div>
          </div>
          
          <div className="relative hover:cursor-pointer" onClick={() => handleCouponClick(product.coupon)}>
              <FontAwesomeIcon icon={faTicketAlt} />
              <div className="tooltip absolute -top-0 left-3 whitespace-nowrap bg-black text-white text-xs h-6 rounded py-1 px-2 opacity-0 hover:opacity-100 z-20">
                  See all coupons
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
