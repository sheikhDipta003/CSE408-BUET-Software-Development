import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
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
            Copyright &copy; <span id="year">{new Date().getFullYear()}</span>
          </p>
          <p className="text-right">All Rights Reserved</p>
        </div>
      </section>
    </footer>
  );
};

export default Footer;
