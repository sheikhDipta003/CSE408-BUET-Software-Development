import { Outlet } from "react-router-dom";
import Header from './Header';
import Footer from './Footer';
import Nav from './Nav';
import Menu from './Menu';
import { DataProvider } from '../context/DataContext';

const Layout = () => {
    return (
        <main className="App">
            <Header title="Techshoppers" />
            <DataProvider>
                <Nav />
                <Menu/>
                <Outlet />
            </DataProvider>
            <Footer />
        </main>
    )
}

export default Layout