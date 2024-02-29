import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Nav from "./Nav";
import Menu from "./Menu";
import Home from "./Home";
//import { DataProvider } from "../context/DataContext";
import ScrollToTop from "./ScrollToTop";

const Layout = () => {
  const location = useLocation();

  return (
    <main className="App">
      <Header title="Techshoppers" />

      <Nav />
      <Menu />
      {location.pathname === "/" && <Home />}
      <Outlet />
      <ScrollToTop />
      <Footer />
    </main>
  );
};

export default Layout;
