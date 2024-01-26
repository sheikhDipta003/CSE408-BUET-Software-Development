import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import '../css/UserDropDown.css';
import Logout from './Logout';

const UserDropDown = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div className="dropdown-container">
      <div className="dropdown-trigger" onClick={toggleDropdown}>
        <FontAwesomeIcon icon={faUser} color="white" />
        <FontAwesomeIcon icon={isOpen ? faCaretUp : faCaretDown} color="white" />
      </div>

      {isOpen && (
        <div className="dropdown-menu">
          <Link to="/home" className="text-right w-full px-4 py-3 mt-0 no-underline block text-black transition bg-slate-100 hover:bg-slate-300 duration-200">Homepage</Link>

          <Link to="/user/1/wishlist" className="text-right w-full px-4 py-3 mt-0 no-underline block text-black transition bg-slate-100 hover:bg-slate-300 duration-200">Wishlist</Link>

          <Link to="/user/1/viewprofile" className="text-right w-full px-4 py-3 mt-0 no-underline block text-black transition bg-slate-100 hover:bg-slate-300 duration-200">Settings</Link>

          <div className="text-right w-full px-4 py-3 mt-0 no-underline block text-black transition bg-slate-100 hover:bg-slate-300 duration-200">Vouchers</div>

          <Logout/>
        </div>
      )}
    </div>
  );
};

export default UserDropDown;
