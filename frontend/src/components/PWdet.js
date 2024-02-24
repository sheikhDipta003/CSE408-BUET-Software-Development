import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAuth from "../hooks/useAuth";

const ROLES = {
  Admin: 5150,
  Collaborator: 1984,
  User: 2001,
};

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

const ProductDetails = () => {
  const [product, setProduct] = useState([]);
  const [website, setWebsites] = useState([]);
  const [name, setName] = useState("");
  const [specs, setSpecs] = useState([]);
  const [prices, setPrices] = useState([]);
  const [pricesConv, setPricesConv] = useState([]);
  const { productId, websiteId } = useParams();
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();
  const [clickcount, setClickcount] = useState(0);
  const location = useLocation();
  const [priceDrop, setPriceDrop] = useState("");
  const [showWarning, setShowWarning] = useState(false);

  //let data = {};
  useEffect(() => {
    const fetchData = async () => {
      try {
        let response = await fetch(
          `http://localhost:5000/products/${productId}/${websiteId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

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
  }, [productId, websiteId]); // Empty dependency array means this effect runs only once on mount

  const handleCreateAlert = async () => {
    console.log("Creating price drop alert...");

    if (auth?.roles === ROLES.User) {
      try {
        const response = await axiosPrivate.post(
          `users/${auth.userId}/alerts/pricedrop`,
          { productId, websiteId, price: priceDrop },
        );
        alert(response.data.message);
      } catch (err) {
        console.error("Error creating price drop alert:", err);
        alert(err.response?.data?.message || err.message);
      } finally {
        setPriceDrop("");
      }
    } else if (auth?.accessToken) {
      navigate("/unauthorized");
    } else navigate("/login");
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setPriceDrop(value);
    setShowWarning(false);
  };

  const handleSubmit = () => {
    // Check if the input is a positive integer
    if (isNaN(parseInt(priceDrop)) || parseInt(priceDrop) < 0) {
      setShowWarning(true);
      return;
    }

    handleCreateAlert();
  };

  useEffect(() => {
    // Convert prices to pricesConv and update state
    if (prices.length !== pricesConv.length) {
      setPricesConv(
        prices.map((item) => ({
          date: item.date,
          price: parseInt(item.price, 10),
        })),
      );
    }
    console.log(pricesConv);
  }, [prices]);

  const priceData = [
    { date: "2022-01-01", price: 100 },
    { date: "2022-01-02", price: 120 },
    { date: "2022-01-03", price: 90 },
  ];
  const [wishlist, setWishlist] = useState(false);
  const handleAddToWishlist = async (pwId) => {
    setWishlist(!wishlist);

    //this option is available only for logged in users
    if (auth?.roles === ROLES.User) {
      try {
        const response = await axiosPrivate.post(
          `/users/${auth.userId}/wishlist/${pwId}/add`,
        );
        alert(response.data.message);
        await axiosPrivate.get(`users/${auth.userId}/${pwId}/clicks/create`);
      } catch (err) {
        if (err.response.status === 400) {
          try {
            const response = await axiosPrivate.post(
              `/users/${auth.userId}/clicks`,
              { productId: productId, websiteId: websiteId },
            );
            setClickcount(response.data.clickcount);
          } catch (err) {
            alert(err.response.data.message);
          }
        }
      } finally {
        try {
          await axiosPrivate.put(`/users/${auth.userId}/clicks/update`, {
            clickcount: clickcount + 1,
            productId: productId,
            websiteId: websiteId,
          });
        } catch (err) {
          alert(err.response.data.message);
        }
      }
    } else if (auth?.accessToken) {
      navigate("/unauthorized");
    } else navigate("/login");
  };

  const goToWebsite = () => {
    navigate(``);
  };
  const data = {
    labels: pricesConv.map((entry) => entry.date),
    datasets: [
      {
        label: "Price",
        data: pricesConv.map((indData) => indData.price),
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };
  return (
    <div className="container mx-auto mt-8">
      <div className="flex justify-center items-center">
        <img
          src={product.imagePath}
          alt={product.productName}
          className="w-1/2 md:w-1/4 object-cover"
        />

        <div className="ml-4">
          <div>
            <h2 className="text-xl font-semibold">{product.productName}</h2>
            <p>
              <strong>Website: </strong>
              {name}
            </p>
            <p>
              <strong>Brand: </strong>
              {product.brand}
            </p>
            <p>
              <strong>Category: </strong>
              {product.category}
            </p>
            <p>
              <strong>Subcategory: </strong>
              {product.subcategory}
            </p>
          </div>
        </div>
        <div className="ml-10">
          <a href={website.pwURL} target="_blank" rel="noopener noreferrer">
            <button className="bg-blue-500 text-white px-4 py-2">
              Visit Website
            </button>
          </a>
          <br></br>
          <button
            className="bg-green-500 text-white px-4 py-2"
            onClick={() => handleAddToWishlist(website.pwId)}
          >
            Add to wishlist
          </button>
        </div>
        {/* <div className="col-md-2"> */}
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
        {/* <a href={website.pwURL} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
            Visit Website
          </a> */}
        {/* </div> */}
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
              <th className="w-1/2 border-b border-black px-4 py-2">
                Specification
              </th>
              <th className="w-1/2 border-b border-black px-4 py-2">Value</th>
            </tr>
          </thead>
          <tbody>
            {specs.map((spec, index) => (
              <tr key={index}>
                {/* <td>{spec.Spec.specTitle}</td> */}
                <td className="w-1/2 border-b border-black px-4 py-2 text-center">
                  {spec.specName}
                </td>
                <td className="w-1/2 border-b border-black px-4 py-2 text-center">
                  {spec.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-evenly">
        {/* Left Div */}
        <div className="w-1/2 p-0">
          <h2 className="text-xl font-bold mb-2">Set Price Drop Alert</h2>
          <p className="text-gray-600">
            Enter the desired price drop below and click 'Create Alert' to set
            up a price drop alert for this product.
          </p>
        </div>

        {/* Right Div */}
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Enter price drop"
            value={priceDrop}
            onChange={handleChange}
            className="border-2 rounded-md px-4 py-2 mr-2"
          />
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4"
          >
            Create Alert
          </button>
        </div>

        <p className={showWarning ? "errmsg" : "offscreen"}>
          Enter a positive integer
        </p>
      </div>

      <div className="mt-2 flex justify-center items-center">
        <h2>Product Price Chart</h2>
      </div>

      <div className="flex justify-center items-center">
        <div className="w-3/5 mt-2">
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
    </div>
  );
};

export default ProductDetails;
