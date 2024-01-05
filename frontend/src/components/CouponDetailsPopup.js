import React from 'react';
import '../css/CouponDetailsPopup.css'; // Create this CSS file

const CouponDetailsPopup = ({ coupon, onClose }) => {
    if (!coupon) {
        return null;
    }

    return (
        <div className="coupon-popup">
            <div className="coupon-details">
                <p>Code: {coupon.code}</p>
                <p>Discount Percentage: {coupon.discount_percentage}</p>
                <p>Discount Amount: {coupon.discount_amount}</p>
                <p>Description: {coupon.description}</p>
                <p>Terms: {coupon.terms}</p>
                <p>Start Date: {coupon.start_date}</p>
                <p>End Date: {coupon.end_date}</p>
            </div>
            <button onClick={onClose}>Close</button>
        </div>
    );
};

export default CouponDetailsPopup;
