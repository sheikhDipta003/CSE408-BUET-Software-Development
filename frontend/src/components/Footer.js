import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const Footer = () => {
  const today = new Date();
  const openingHours = {
    Monday: "10am - 7pm",
    Tuesday: "10am - 7pm",
    Wednesday: "10am - 7pm",
    Thursday: "10am - 7pm",
    Friday: "Closed",
    Saturday: "10am - 7pm",
    Sunday: "10am - 7pm",
  };

  const currentDay = new Date().toLocaleDateString("en-us", {
    weekday: "long",
  });
  const hoursToday = openingHours[currentDay];

  return (
    <footer
      id="footer"
      className="text-xl text-black w-full bg-[#66d8f5] p-3 flex justify-between items-center place-content-center"
    >
      <section className="mx-auto flex max-w-4xl flex-col p-4 sm:flex-row sm:justify-between">
        <address>
          <h2>TechShoppers</h2>
          Head Office: 28 Kazi Nazrul Islam Ave,Navana Zohura Square
          <br />
          Dhaka 1000
          <br />
          Email:
          <a href="webteam@techshoppers.com">"webteam@techshoppers.com"</a>
          <br />
          <section className="rounded border-2 border-zinc-950 w-1/6">
            <div className="px-1">
              <FontAwesomeIcon icon={faPhone} className="text-lg" />
            </div>
            <div className="py-1">
              <p>{hoursToday}</p>
              <p className="text-red-600">16666</p>
            </div>
          </section>
        </address>
        <nav className="hidden flex-col gap-2 md:flex" aria-label="footer">
          <Link to="/about" className="hover:opacity-90">
            About Us
          </Link>
          <Link to="/home" className="hover:opacity-90">
            Terms and Conditions
          </Link>
          <Link to="/home" className="hover:opacity-90">
            Privacy Policy
          </Link>
          <Link to="/home" className="hover:opacity-90">
            Contact Us
          </Link>
        </nav>
        <div className="flex flex-col sm:gap-2">
          <p className="text-right">
            Copyright &copy; <span id="year">{today.getFullYear()}</span>
          </p>
          <p className="text-right">All Rights Reserved</p>
        </div>
      </section>
    </footer>
  );
};

export default Footer;
