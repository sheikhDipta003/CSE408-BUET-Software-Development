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
      <h2 className="text-4xl font-bold mb-2 mt-8 text-center border-b-4 border-red-500">
        {title}
      </h2>
      <Carousel
        showArrows={true}
        showStatus={false}
        showIndicators={true}
        showThumbs={false}
        infiniteLoop={true}
        selectedItem={0}
        renderArrowPrev={(clickHandler, hasPrev) => {
          return (
            <div
              className={`${
                hasPrev ? "absolute" : "hidden"
              } top-0 bottom-0 left-0 flex justify-center items-center p-3 opacity-30 bg-gray-100 hover:opacity-70 cursor-pointer z-10`}
              onClick={clickHandler}
            >
              &#9664;
            </div>
          );
        }}
        renderArrowNext={(clickHandler, hasNext) => {
          return (
            <div
              className={`${
                hasNext ? "absolute" : "hidden"
              } top-0 bottom-0 right-0 flex justify-center items-center p-3 opacity-30 bg-gray-100 hover:opacity-70 cursor-pointer z-10`}
              onClick={clickHandler}
            >
              &#9654;
            </div>
          );
        }}
        renderIndicator={(onClickHandler, isSelected, index, label) => {
          const defaultStyles = {
            width: '10px',
            height: '10px',
            backgroundColor: 'gray', // Default background color for dots
            margin: '0 6px', // Adjust the spacing between dots
            display: 'inline-block',
            cursor: 'pointer',
            borderRadius: '50%',
          };

          const selectedStyles = {
            backgroundColor: 'red', // Background color for the selected dot
          };

          return (
            <li
              onClick={onClickHandler}
              onKeyDown={onClickHandler}
              value={index}
              key={index}
              role="button"
              tabIndex={0}
              title={`${label} ${index + 1}`}
              aria-label={`${label} ${index + 1}`}
              style={isSelected ? { ...defaultStyles, ...selectedStyles } : defaultStyles}
            />
          );
        }}
      >
        {productChunks.map((chunk, index) => (
          <div
            key={index}
            className="flex justify-center items-center bg-antiquewhite mb-10"
          >
            {chunk.map((product, idx) => (
              <ProductCard key={idx} product={product} userId={userId} />
            ))}
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default CarouselSection;
