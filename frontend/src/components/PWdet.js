import React, { useEffect, useState } from 'react';
import {Table} from 'react-bootstrap';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
  import { Line } from 'react-chartjs-2';
import 'bootstrap/dist/css/bootstrap.min.css';
//import 'chart.js/dist/chart.min.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );


const ProductDetails = () => {
    const priceData = [
                { date: '2022-01-01', price: 100 },
                { date: '2022-01-02', price: 120 },
                { date: '2022-01-03', price: 90 },
              ];
    const [prices, setPrices] = useState(null);
    const [wishlist, setWishlist] = useState(false);
    const handleAddToWishlist = () => {
        setWishlist(!wishlist);
        //console.log('Product added to wishlist:', product.productName);
      };
    //   useEffect(()=>{
    //     
    //     setPrices({
    //         labels: ['2022-01-01', '2022-01-02', '2022-01-03'],
    //         datasets: [{
    //             label: 'Price',
    //             data: priceData.map((indData)=>indData.price),
    //         }]
    //     })
    //   }, [prices])
    const data = {
                labels : priceData.map(entry => entry.date),
                datasets: [{
                    label: 'Price',
                    data: priceData.map((indData)=>indData.price),
                }]
            }
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
          <div className="col-md-2">
          {!wishlist && (
            <button className="btn btn-primary" onClick={handleAddToWishlist}>
              Add to Wishlist
            </button>
          )}
          {wishlist && (
            <button className="btn btn-primary" onClick={handleAddToWishlist}>
              Added to Wishlist
            </button>
          )}
        </div>
      </div>
      <hr className="my-4" />
      <h3>Prouct Specifications:</h3>
      <table className="table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Name</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        {/* {specs.map((spec, index) => (
          <tr key={index}>
            {index === 0 && <td rowSpan={specs.length}>{spec.title}</td>}
            <td>{spec.name}</td>
            <td>{spec.value}</td>
          </tr>
        ))} */}
        <tr>
          <td>Title</td>
          <td>Name</td>
          <td>Value</td>
        </tr>
      </tbody>
    </table>
      <div className="container mt-4">
      <h2>Product Price Chart</h2>
      <Line data={data}/>
    </div>
    </div>
    
  );
};

export default ProductDetails;
