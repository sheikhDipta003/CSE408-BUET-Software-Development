import { Link } from 'react-router-dom';
import UserDropDown from './UserDropDown.js';
import SearchBar from './SearchBar.js';
import useAuth from "../hooks/useAuth";

const Nav = () => {
    const { auth } = useAuth();

    return (
        <nav className="Nav">
            <SearchBar/>
            <ul>
                {auth?.accessToken
                    ? <UserDropDown/>
                    : <>
                        <li><Link to="/login">Login</Link></li>
                        <li><Link to="/register">Register</Link></li>
                      </>
                }
            </ul>
        </nav>
    )
}

export default Nav
