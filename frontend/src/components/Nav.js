import { Link } from "react-router-dom";
import UserDropDown from "./UserDropDown.js";
import SearchBar from "./SearchBar.js";
import useAuth from "../hooks/useAuth";
import AdminDropdown from "./AdminDropdown.js";

const ROLES = {
  Admin: 5150,
  Collaborator: 1984,
  User: 2001,
};

const Nav = () => {
  const { auth } = useAuth();

  console.log("from Nav.js = ", auth.userId);

  return (
    <nav className="Nav">
      <SearchBar />
      <ul>
        {auth?.accessToken ? (
          auth.roles === ROLES.Admin || auth.roles === "Admin" ? (
            <AdminDropdown />
          ) : (
            <UserDropDown userId={auth.userId} />
          )
        ) : (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Nav;
