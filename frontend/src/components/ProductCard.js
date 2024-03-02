import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookmark,
  faInfoCircle,
  faShoppingCart,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const ProductCard = ({ product, userId }) => {
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();

  const handleBookmarkClick = async (pwId, productId, websiteId) => {
    console.log("Bookmarking this item for logged-in user");
    try {
      await axiosPrivate.post(`/users/${userId}/wishlist/${pwId}/add`);
      const response = await axiosPrivate.post(`/users/${userId}/clicks`, {
        productId: productId,
        websiteId: websiteId,
      });
      console.log(response.data.clickcount);

      await axiosPrivate.put(`/users/${userId}/clicks/update`, {
        clickcount: response.data.clickcount + 1,
        productId: productId,
        websiteId: websiteId,
      });

      alert(response.data.message);
    } catch (err) {
      console.error(err.response.status);
      console.error(err.response.data.message);
      alert(err.response.data.message);
    }
    navigate(`/users/${userId}/viewprofile`);
  };

  const handleDetailsClick = (productId, websiteId) => {
    console.log("Showing details for the product");
    navigate(`/products/${productId}/${websiteId}`);
  };

  const handleShopNowClick = (url) => {
    console.log("Redirecting to the shopping page");
    window.open(url, "_blank");
  };

  return (
    <div className="product-card flex border border-solid border-gray-400 w-96 h-72 z-30">
      {/* Left Partition - Image */}
      <div className="flex items-center justify-center">
        <img src={product.imagePath} alt={product.productName} />
      </div>

      {/* Right Partition - Product Details */}
      <div className="w-5/6 p-2 flex flex-col items-center justify-center">
        <h3 className="text-base font-bold mb-2">{product.productName}</h3>
        <p className="text-base">Website: {product.websiteName}</p>
        <p className="text-base">Price: {product.price}</p>

        {/* Icons Section */}
        <div className="icons flex justify-end space-x-4 mt-2">
          {/* <div
            className="bookmark-icon relative hover:cursor-pointer"
            onClick={(e) => {
              handleBookmarkClick(
                product.pwId,
                product.productId,
                product.websiteId,
              );
            }}
          >
            <FontAwesomeIcon icon={faBookmark} />
          </div> */}

          <div
            className="details-icon relative hover:cursor-pointer"
            onClick={(e) => {
              handleDetailsClick(product.productId, product.websiteId);
            }}
          >
            <FontAwesomeIcon icon={faInfoCircle} />
          </div>

          <div
            className="shop-now-icon relative hover:cursor-pointer"
            onClick={(e) => {
              handleShopNowClick(product.pwURL);
            }}
          >
            <FontAwesomeIcon icon={faShoppingCart} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
