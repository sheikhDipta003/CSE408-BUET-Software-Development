import { Link } from 'react-router-dom';
import UserDropDown from './UserDropDown.js';
import SearchBar from './SearchBar.js';

const Nav = () => {
    return (
        <nav className="Nav">
            {/* <form className="searchForm" onSubmit={(e) => e.preventDefault()}>
                <label htmlFor="search">Search Posts</label>
                <input
                    id="search"
                    type="text"
                    placeholder="Search for products, brands"
                />
            </form> */}
            <SearchBar/>
            <ul>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/register">Register</Link></li>
                <UserDropDown/>
            </ul>
        </nav>
    )
}

export default Nav
