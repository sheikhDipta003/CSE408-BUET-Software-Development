import React, { useState, useRef, useEffect } from 'react';
import { useParams, Link } from "react-router-dom";
import {Table} from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';



const ProductDetails = () => {
  const [product, setProduct] = useState([]);
  const [website, setWebsites] = useState([]);
  const {productId} = useParams();
  
  useEffect(() => {
    const fetchData = async()=> {
      try{
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
      }catch(error){
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);
  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-4">
          <img src={product.imagePath} alt={product.productName} className="img-fluid rounded" />
        </div>
        <div className="col-md-6">
          <h2>{product.productName}</h2>
          <p>
            <strong>Brand: {product.brand}</strong>
          </p>
          <p>
            <strong>Category: {product.category}</strong>
          </p>
          <p>
            <strong>Subcategory: {product.subcategory}</strong>
          </p>
          </div>
      </div>
      <hr className="my-4" />
      <h3>Prices from different Websites:</h3>
      <Table>
        <thead>
          <tr>
            <th>Website</th>
            <th>Price</th>
            <th>Action</th>
            <th>View Details</th>
          </tr>
        </thead>
        <tbody>
          {website.map((priceInfo, index) => (
            <tr key={index}>
              <td>{priceInfo.Website.name}</td>
              <td>{priceInfo.price}</td>
              <td>
                <a href={priceInfo.pwURL} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                  Visit Website
                </a>
              </td>
              <td>
              <Link to={`/products/${productId}/${priceInfo.Website.websiteId}`} target="_self" rel="noopener noreferrer" className="btn btn-primary">
                Details
              </Link>
              </td>
            </tr>
          ))}
          
        </tbody>
      </Table>
      
    </div>
  );
};

export default ProductDetails;
