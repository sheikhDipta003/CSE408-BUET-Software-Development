import { Outlet } from "react-router-dom";
import Header from './Header';
import Footer from './Footer';
import Nav from './Nav';
import Menu from './Menu';

const Layout = () => {
    return (
        <main className="App">
            <Header title="Techshoppers" />
            <Nav />
            <Menu/>
            <Outlet />
            <Footer />
        </main>
    )
}

export default Layout