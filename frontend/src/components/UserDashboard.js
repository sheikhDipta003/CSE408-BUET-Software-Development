import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import CarouselSection from './CarouselSection';
import StickyMenu from './StickyMenu';
import '../css/ScrollToTopBtn.css';

const recommendedProducts = [{
    "product_id": "p979",
    "name": "HP 15 Laptop, Intel Celeron X941",
    "website_name": "Startech",
    "category":"computers",
    "subcategory":"laptop",
    "brand":"HP",
    "price": 275774,
    "date_added": "2023-03-19",
    "image": "https://m.media-amazon.com/images/W/MEDIAX_792452-T2/images/I/71OyrTkxpGL._AC_SL1500_.jpg"
  }, {
    "product_id": "p356",
    "name": "HP 16 Laptop, Intel Celeron L064",
    "website_name": "Startech",
    "category":"computers",
    "subcategory":"laptop",
    "brand":"HP",
    "price": 42467,
    "date_added": "2022-11-05",
    "image": "https://m.media-amazon.com/images/W/MEDIAX_792452-T2/images/I/71OyrTkxpGL._AC_SL1500_.jpg"
  }, {
    "product_id": "p482",
    "name": "HP 16 Laptop, Intel Celeron M085",
    "website_name": "Ryans",
    "category":"computers",
    "subcategory":"laptop",
    "brand":"HP",
    "price": 242773,
    "date_added": "2023-03-16",
    "image": "https://m.media-amazon.com/images/W/MEDIAX_792452-T2/images/I/51KupiNLuHL._AC_SL1280_.jpg"
  }, {
    "product_id": "p716",
    "name": "HP 11 Laptop, Intel Celeron V665",
    "website_name": "Ryans",
    "category":"computers",
    "subcategory":"laptop",
    "brand":"HP",
    "price": 357010,
    "date_added": "2022-08-16",
    "image": "https://m.media-amazon.com/images/W/MEDIAX_792452-T2/images/I/51KupiNLuHL._AC_SL1280_.jpg"
  }, {
    "product_id": "p152",
    "name": "HP 11 Laptop, Intel Celeron W025",
    "website_name": "Daraz",
    "category":"computers",
    "subcategory":"laptop",
    "brand":"HP",
    "price": 264211,
    "date_added": "2022-07-19",
    "image": "https://m.media-amazon.com/images/W/MEDIAX_792452-T2/images/I/71OyrTkxpGL._AC_SL1500_.jpg"
  }, {
    "product_id": "p400",
    "name": "HP 11 Laptop, Intel Celeron I927",
    "website_name": "Ryans",
    "category":"computers",
    "subcategory":"laptop",
    "brand":"HP",
    "price": 338670,
    "date_added": "2023-04-29",
    "image": "https://m.media-amazon.com/images/W/MEDIAX_792452-T2/images/I/51KupiNLuHL._AC_SL1280_.jpg"
  }, {
    "product_id": "p624",
    "name": "HP 15 Laptop, Intel Celeron R812",
    "website_name": "Startech",
    "category":"computers",
    "subcategory":"laptop",
    "brand":"HP",
    "price": 93647,
    "date_added": "2023-02-07",
    "image": "https://m.media-amazon.com/images/W/MEDIAX_792452-T2/images/I/51KupiNLuHL._AC_SL1280_.jpg"
  }, {
    "product_id": "p488",
    "name": "HP 10 Laptop, Intel Celeron B835",
    "website_name": "Startech",
    "category":"computers",
    "subcategory":"laptop",
    "brand":"HP",
    "price": 255692,
    "date_added": "2024-01-03",
    "image": "https://m.media-amazon.com/images/W/MEDIAX_792452-T2/images/I/51KupiNLuHL._AC_SL1280_.jpg"
  }, {
    "product_id": "p076",
    "name": "HP 17 Laptop, Intel Celeron I617",
    "website_name": "Startech",
    "category":"computers",
    "subcategory":"laptop",
    "brand":"HP",
    "price": 47485,
    "date_added": "2022-09-09",
    "image": "https://m.media-amazon.com/images/W/MEDIAX_792452-T2/images/I/71OyrTkxpGL._AC_SL1500_.jpg"
  }, {
    "product_id": "p922",
    "name": "HP 13 Laptop, Intel Celeron Y926",
    "website_name": "Startech",
    "category":"computers",
    "subcategory":"laptop",
    "brand":"HP",
    "price": 235805,
    "date_added": "2022-06-13",
    "image": "https://m.media-amazon.com/images/W/MEDIAX_792452-T2/images/I/51KupiNLuHL._AC_SL1280_.jpg"
}];
const topOffers = recommendedProducts;
const trendingProducts = recommendedProducts;

const UserDashboard = () => {
  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      console.log(window.scrollY);
      if (window.scrollY > 300) {
        setShowTopBtn(true);
        console.log("Now the button will be shown");
      } else {
        setShowTopBtn(false);
      }
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);

    // Clean up the event listener
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="user-dashboard">
      <StickyMenu />
      
      <CarouselSection title="Recommended Products" id="recommendedProducts" products={recommendedProducts} 
        style={{"padding": "10px 0", "min-height": "600px", "marginBottom":"10px"}}
      />
      <CarouselSection title="Top Offers" id="topOffers" products={topOffers} 
        style={{"padding": "10px 0", "min-height": "600px", "marginBottom":"10px"}}
      />
      <CarouselSection title="Trending Products" id="trendingProducts" products={trendingProducts} 
        style={{"padding": "10px 0", "min-height": "600px", "marginBottom":"10px"}}
      />

      {showTopBtn && (
        <button onClick={scrollToTop} className="top-btn">
          <FontAwesomeIcon icon={faArrowUp} />
        </button>
      )}
    </div>
  );
};

export default UserDashboard;
