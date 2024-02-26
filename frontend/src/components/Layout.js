import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Nav from "./Nav";
import Menu from "./Menu";
//import { DataProvider } from "../context/DataContext";
import ScrollToTop from "./ScrollToTop";

const Layout = () => {
  return (
    <main className="App">
      <Header title="Techshoppers" />

      <Nav />
      <Menu />
      <Outlet />
      <ScrollToTop />
      <Footer />
    </main>
  );
};

export default Layout;
