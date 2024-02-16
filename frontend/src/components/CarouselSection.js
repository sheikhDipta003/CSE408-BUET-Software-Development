import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import ProductCard from "./ProductCard";

const CarouselSection = ({ title, id, userId, products }) => {
  const chunkProducts = (products, size) => {
    const chunked = [];
    for (let i = 0; i < products.length; i += size) {
      chunked.push(products.slice(i, i + size));
    }
    return chunked;
  };

  const productChunks = chunkProducts(products, 3);

  return (
    <div id={id} className="w-[95vw] mb-3">
      <h2 className="text-4xl font-bold mb-2 mt-8 text-center border-b-4 border-red-500">{title}</h2>
      <Carousel
        showArrows={true}
        showStatus={false}
        // showIndicators={false}
        showThumbs={false}
        infiniteLoop={true}
      >
        {productChunks.map((chunk, index) => (
          <div
            key={index}
            className="flex justify-center items-center bg-antiquewhite"
          >
            {chunk.map((product, idx) => (
              <ProductCard key={idx} product={product} userId={userId}/>
            ))}
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default CarouselSection;
