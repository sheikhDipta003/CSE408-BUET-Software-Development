import React, { useEffect, useState } from "react";
import { Link, Events } from "react-scroll";
import "../css/StickyMenu.css";

const StickyMenu = () => {
  useEffect(() => {
    Events.scrollEvent.register("begin", function () {
      console.log("begin", arguments);
    });

    Events.scrollEvent.register("end", function () {
      console.log("end", arguments);
    });

    return () => {
      Events.scrollEvent.remove("begin");
      Events.scrollEvent.remove("end");
    };
  }, []);

  return (
    <div className="sticky-menu">
      <Link
        activeClass="active"
        to="recommendedProducts"
        spy={true}
        smooth={true}
        offset={-70}
        duration={500}
      >
        Recommended Products
      </Link>
      <Link
        activeClass="active"
        to="topOffers"
        spy={true}
        smooth={true}
        offset={-70}
        duration={500}
      >
        Top Offers
      </Link>
      <Link
        activeClass="active"
        to="trendingProducts"
        spy={true}
        smooth={true}
        offset={-70}
        duration={500}
      >
        Trending Products
      </Link>
    </div>
  );
};

export default StickyMenu;
