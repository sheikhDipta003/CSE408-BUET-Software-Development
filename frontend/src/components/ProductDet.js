import React, { useState, useRef } from 'react';
import {Table} from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';

const ProductDetails = () => {
  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-4">
          <img src="https://m.media-amazon.com/images/W/MEDIAX_792452-T2/images/I/81vzIB8T1wS._AC_SL1500_.jpg" alt="{product.productName}" className="img-fluid rounded" />
        </div>
        <div className="col-md-6">
          <h2>product.productName</h2>
          <p>
            <strong>Brand:</strong>
          </p>
          <p>
            <strong>Category:</strong>
          </p>
          <p>
            <strong>Subcategory:</strong>
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
          </tr>
        </thead>
        <tbody>
          {/* {product.prices.map((priceInfo, index) => (
            <tr key={index}>
              <td>{priceInfo.website}</td>
              <td>${priceInfo.price.toFixed(2)}</td>
              <td>
                <a href="www.google.com" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                  Visit Website
                </a>
              </td>
            </tr>
          ))} */}
          <tr>
            <td>Website</td>
            <td></td>
            <td>
                <a href="https://www.google.com" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                  Visit Website
                </a>
              </td>
          </tr>
        </tbody>
      </Table>
      
    </div>
  );
};

export default ProductDetails;
