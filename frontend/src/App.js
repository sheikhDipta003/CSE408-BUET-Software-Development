import Register from './components/Register';
import Login from './components/Login';
import Home from './components/Home';
import Layout from './components/Layout';
import Admin from './components/Admin';
import Missing from './components/Missing';
import Unauthorized from './components/Unauthorized';
import RequireAuth from './components/RequireAuth';
import ProductListing from './components/ProductListing';
import UserProfile from './components/UserProfile';
import { Routes, Route } from 'react-router-dom';
import ProductFilter from './components/ProductFilter';
import ProductDetails from './components/ProductDetails';
import Wishlist from './components/Wishlist';
import UserDashboard from './components/UserDashboard';
import About from './components/About';
import PersistLogin from './components/PersistLogin';
import Logout from './components/Logout';

const ROLES = {
  "Admin": 5150,
  "Collaborator": 1984,
  "User": 2001
};

function App() {

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
      <Route path="home" element={<Home />} />
      <Route path="about" element={<About />} />
      <Route path="login" element={<Login />} />
      <Route path="logout" element={<Logout />} />
      <Route path="register" element={<Register />} />
      <Route path="products/filter" element={<ProductFilter />} />
      <Route path="productlisting/:category/:subcategory" element={<ProductListing />} />
      <Route path="productlisting/:category/:subcategory/:product_id" element={<ProductDetails />} />
      <Route path="unauthorized" element={<Unauthorized />} />

      <Route element={<PersistLogin/>}>
        <Route element={<RequireAuth allowedRoles={ROLES.User} />}>
          <Route path="user/:user_id/viewprofile" element={<UserProfile />} />
        </Route>

        <Route element={<RequireAuth allowedRoles={ROLES.User} />}>
          <Route path="user/:user_id/wishlist" element={<Wishlist />} />
        </Route>

        <Route element={<RequireAuth allowedRoles={ROLES.User} />}>
          <Route path="user/:user_id/dashboard" element={<UserDashboard />} />
        </Route>
        
        <Route element={<RequireAuth allowedRoles={ROLES.Admin} />}>
          <Route path="admin" element={<Admin />} />
        </Route>
      </Route>

        <Route path="*" element={<Missing />} />
      </Route>
    </Routes>
  );
}

export default App;