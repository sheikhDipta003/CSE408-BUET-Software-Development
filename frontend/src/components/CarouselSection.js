import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import ProductCard from './ProductCard';

const CarouselSection = ({ title, id, products }) => {
  const chunkProducts = (products, size) => {
    const chunked = [];
    for (let i = 0; i < products.length; i += size) {
      chunked.push(products.slice(i, i + size));
    }
    return chunked;
  };

  const productChunks = chunkProducts(products, 4);
  
  return (
    <div id={id} style={{"width":"95vw", "marginBottom":"10px"}}>
      <h2>{title}</h2>
      <div style={{"width":"95vw", "height":"0.5vh","backgroundColor":"red", "marginBottom":"5px"}}></div>
      <Carousel showArrows={true} showStatus={false} showIndicators={false} showThumbs={false} infiniteLoop={true}>
      {productChunks.map((chunk, index) => (
        <div key={index} className="flex justify-center items-center bg-antiquewhite">
        {chunk.map((product, idx) => (
          <ProductCard key={idx} product={product} />
        ))}
        </div>
      ))}
      </Carousel>
    </div>
  );

};

export default CarouselSection;
