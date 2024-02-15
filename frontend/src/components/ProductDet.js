import React, { useState, useRef, useEffect } from 'react';
import { useParams, Link } from "react-router-dom";
// import {Table} from 'react-bootstrap'
// import 'bootstrap/dist/css/bootstrap.min.css';



const ProductDetails = () => {
  const [product, setProduct] = useState([]);
  const [website, setWebsites] = useState([]);
  const [specs, setSpecs] = useState([]);
  const { productId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(productId);
        let response = await fetch(`http://localhost:5000/products/${productId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          }
        });

        response = await response.json();
        setProduct(response.productDetails);
        const productWebsiteTs = response.productDetails.ProductWebsites;
        console.log(productWebsiteTs);
        setWebsites(productWebsiteTs);
        const specs = response.productDetails.ProductSpecs;
        setSpecs(specs);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [productId]);
  return (
    <div className="container mx-auto mt-8 content-center">
      <div className="flex justify-center items-center">

        <img
          src={product.imagePath}
          alt={product.productName}
          className="w-1/2 md:w-1/4 object-cover" />

        <div className="ml-4">
          <div>
            <h2 className="text-xl font-semibold">{product.productName}</h2>
            <p className="text-gray-600">
              <strong>Brand: </strong>{product.brand}
            </p>
            <p className="text-gray-600">
              <strong>Category: </strong>{product.category}
            </p>
            <p className="text-gray-600">
              <strong>Subcategory: </strong>{product.subcategory}
            </p>
          </div>
        </div>
      </div>
      <hr className="my-4" />
      <div className="mt-2 flex justify-center items-center">
        <h3 className="text-lg font-semibold mb-4">Prices from different Websites:</h3>
      </div>
      <div className="mt-2 flex justify-center items-center">
        <table className="w-3/5 border-collapse border border-black mb-10">
          <thead>
            <tr>
              <th className="w-3/10 border border-black px-4 py-2">Website</th>
              <th className="w-3/10 border border-black px-4 py-2">Price</th>
              <th className="w-1/5 border border-black px-4 py-2">Action</th>
              <th className="w-1/5 border border-black px-4 py-2">View Details</th>
            </tr>
          </thead>
          <tbody>
            {website.map((priceInfo, index) => (
              <tr key={index}>
                <td className="border border-black px-4 py-2 text-center">{priceInfo.Website.name}</td>
                <td className="border border-black px-4 py-2 text-center">{priceInfo.price}</td>
                <td className="border border-black px-4 py-2">
                  <a href={priceInfo.pwURL} target="_blank" rel="noopener noreferrer">
                    <button className="bg-blue-500 text-white px-4 py-2">
                      Buy now
                    </button>
                  </a>
                </td>
                <td className="border border-black px-4 py-2">
                  <Link to={`/products/${productId}/${priceInfo.Website.websiteId}`} target="_self" rel="noopener noreferrer">
                    <button className="bg-blue-500 text-white px-4 py-2">
                      Details
                    </button>
                  </Link>
                </td>
              </tr>
            ))}

          </tbody>
        </table>
      </div>
      <hr className="mt-8" />
      <div className="mt-2 flex justify-center items-center">
        <h3 className="text-lg font-semibold mb-4">Product Specifications:</h3>
      </div>
      <div className="mt-2 flex justify-center items-center">
        <table className="w-3/5 border-collapse border border-black mb-10">
          <thead>
            <tr>
              {/* <th>Title</th> */}
              <th className="w-1/2 border-b border-black px-4 py-2">Specification</th>
              <th className="w-1/2 border-b border-black px-4 py-2">Value</th>
            </tr>
          </thead>
          <tbody>
            {specs.map((spec, index) => (
              <tr key={index}>
                {/* <td>{spec.Spec.specTitle}</td> */}
                <td className="w-1/2 border-b border-black px-4 py-2 text-center">{spec.specName}</td>
                <td className="w-1/2 border-b border-black px-4 py-2 text-center">{spec.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div >
  );
};

export default ProductDetails;
