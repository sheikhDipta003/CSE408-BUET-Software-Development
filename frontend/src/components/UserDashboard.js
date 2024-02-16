import React, { useState, useEffect } from "react";
import CarouselSection from "./CarouselSection";
import StickyMenu from "./StickyMenu";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate, useLocation, useParams, Link } from "react-router-dom";

const UserDashboard = () => {
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [topOffers, setTopOffers] = useState([]);
  const axiosPrivate = useAxiosPrivate();
  const {userId} = useParams();

  useEffect(() => {
    let isMounted = true;

    const getRecommend = async () => {
      try {
        const response = await axiosPrivate.get(`/users/${userId}/recommend`);
        console.log("from recommend = ", response.data.recommendations);
        isMounted && setRecommendedProducts(response.data.recommendations);
        
        const response2 = await axiosPrivate.get(`/users/trending`);
        console.log("from trending = ", response2.data.trending);
        isMounted && setTrendingProducts(response2.data.trending);
        isMounted && setTopOffers(response2.data.trending);
      } catch (err) {
        console.error(err);
        alert(err.response?.data?.message || err.message);
      }
    };

    getRecommend();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="user-dashboard">
      <StickyMenu />

      <CarouselSection
        title="Recommended Products"
        id="recommendedProducts"
        userId={userId}
        products={recommendedProducts}
        style={{
          padding: "10px 0",
          "min-height": "600px",
          marginBottom: "10px",
        }}
      />
      <CarouselSection
        title="Trending Products"
        id="trendingProducts"
        userId={userId}
        products={trendingProducts}
        style={{
          padding: "10px 0",
          "min-height": "600px",
          marginBottom: "10px",
        }}
      />
      <CarouselSection
        title="Top Offers"
        id="topOffers"
        userId={userId}
        products={topOffers}
        style={{
          padding: "10px 0",
          "min-height": "600px",
          marginBottom: "10px",
        }}
      />
    </div>
  );
};

export default UserDashboard;
