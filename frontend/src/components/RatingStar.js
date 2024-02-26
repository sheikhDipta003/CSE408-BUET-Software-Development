import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

const RatingStars = ({ rating }) => {
  const filledStars = Math.round(rating);
  const emptyStars = 5 - filledStars;

  return (
    <div className="p-2">
      {[...Array(filledStars)].map((_, index) => (
        <FontAwesomeIcon
          icon={faStar}
          key={index}
          color="gold"
          className="mr-1"
        />
      ))}
      {[...Array(emptyStars)].map((_, index) => (
        <FontAwesomeIcon
          icon={faStar}
          key={index + filledStars}
          color="darkgrey"
          className="mr-1"
        />
      ))}
    </div>
  );
};

export default RatingStars;
