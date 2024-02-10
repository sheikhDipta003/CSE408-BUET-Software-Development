import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from "react-router-dom";
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
  const [product, setProduct] = useState([]);
  const [website, setWebsites] = useState([]);
  const [name, setName] = useState("");
  const [specs, setSpecs] = useState([]);
  const [prices, setPrices] = useState([]);
  const [pricesConv, setPricesConv] = useState([]);
  const {productId, websiteId} = useParams();
  const navigate = useNavigate();
  //let data = {};
  useEffect(() => {
    const fetchData = async () => {
      try {
        let response = await fetch(`http://localhost:5000/products/${productId}/${websiteId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
  
        response = await response.json();
        console.log(response);
        setProduct(response.productDetails);
        const productWebsiteTs = response.productDetails.ProductWebsites[0];
        setWebsites(productWebsiteTs);
        setName(productWebsiteTs.Website.name);
        const specs = response.productDetails.ProductSpecs;
        setSpecs(specs);
        const price = productWebsiteTs.ProductPrices;
        setPrices(price);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    // Call fetchData function inside useEffect
    fetchData();
  }, []); // Empty dependency array means this effect runs only once on mount
  
  useEffect(() => {
    // Convert prices to pricesConv and update state
    if(prices.length !== pricesConv.length){
      setPricesConv(prices.map(item => ({
        date: item.date,
        price: parseInt(item.price, 10),
      })));
    }
    console.log(pricesConv);
  }, [prices]);

    const priceData = [
                { date: '2022-01-01', price: 100 },
                { date: '2022-01-02', price: 120 },
                { date: '2022-01-03', price: 90 },
              ];
    const [wishlist, setWishlist] = useState(false);
    const handleAddToWishlist = () => {
        setWishlist(!wishlist);
        //console.log('Product added to wishlist:', product.productName);
      };

    const goToWebsite = () => {
      navigate(``)
    }
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
                labels : pricesConv.map(entry => entry.date),
                datasets: [{
                    label: 'Price',
                    data: pricesConv.map((indData)=>indData.price),
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }]
            }
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
            <strong>Website: {name}</strong>
          </p>
          <p>
            <strong>Category: {product.category}</strong>
          </p>
          <p>
            <strong>Subcategory: {product.subcategory}</strong>
          </p>
          </div>
          <div className="col-md-2">
          {/* {!wishlist && (
            <button className="btn btn-primary" onClick={handleAddToWishlist}>
              Add to Wishlist
            </button>
          )}
          {wishlist && (
            <button className="btn btn-primary" onClick={handleAddToWishlist}>
              Added to wishlist
            </button>
          )} */}
          <a href={website.pwURL} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                  Visit Website
          </a>
        </div>
      </div>
      <hr className="my-4" />
      <h3>Prouct Specifications:</h3>
      <table className="table">
      <thead>
        <tr>
          {/* <th>Title</th> */}
          <th>Name</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        {specs.map((spec, index) => (
          <tr key={index}>
            {/* <td>{spec.Spec.specTitle}</td> */}
            <td>{spec.specName}</td>
            <td>{spec.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
      <div className="container mt-4">
      <h2>Product Price Chart</h2>
      <Line 
      data={data}
      options={{
        scales: {
          yAxis: {
            min: 0,
          },
        },
    }}
      />
    </div>
    </div>
    
  );
};

export default ProductDetails;
