import Register from './components/Register';
import Login from './components/Login';
import Home from './components/Home';
import Layout from './components/Layout';
import Admin from './components/Admin';
import Missing from './components/Missing';
import Unauthorized from './components/Unauthorized';
import LinkPage from './components/LinkPage';
import RequireAuth from './components/RequireAuth';
import ProductListing from './components/ProductListing';
import UserProfile from './components/UserProfile';
import { Routes, Route } from 'react-router-dom';
import ProductFilter from './components/ProductFilter';

const ROLES = {
  'User': 2001,
  'Admin': 5150
}

function App() {

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="user/:user_id/viewprofile" element={<UserProfile />} />
      <Route path="products/filter" element={<ProductFilter />} />
      <Route path="linkpage" element={<LinkPage />} />
      <Route path="unauthorized" element={<Unauthorized />} />
      <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
        <Route path="admin" element={<Admin />} />
      </Route>
      <Route path="productlisting/:category/:subcategory" element={<ProductListing />} />
      <Route path="*" element={<Missing />} />
      </Route>
    </Routes>
  );
}

export default App;