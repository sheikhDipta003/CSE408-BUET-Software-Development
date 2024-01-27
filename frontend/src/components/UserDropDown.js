import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import '../css/UserDropDown.css';
import Logout from './Logout';
import useAuth from "../hooks/useAuth";

const UserDropDown = ({userId}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const closeDropdown = () => setIsOpen(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="dropdown-container" ref={dropdownRef}>
      <div className="dropdown-trigger" onClick={toggleDropdown}>
        <FontAwesomeIcon icon={faUser} color="white" />
        <FontAwesomeIcon icon={isOpen ? faCaretUp : faCaretDown} color="white" />
      </div>

      {isOpen && (
        <div className="dropdown-menu">
          <Link to="/home" className="text-right w-full px-4 py-3 mt-0 no-underline block text-black transition bg-slate-100 hover:bg-slate-300 duration-200" onClick={closeDropdown}>Homepage</Link>

          <Link to="/user/1/dashboard" className="text-right w-full px-4 py-3 mt-0 no-underline block text-black transition bg-slate-100 hover:bg-slate-300 duration-200" onClick={closeDropdown}>Dashboard</Link>

          <Link to="/user/1/wishlist" className="text-right w-full px-4 py-3 mt-0 no-underline block text-black transition bg-slate-100 hover:bg-slate-300 duration-200" onClick={closeDropdown}>Wishlist</Link>

          <Link to={`/user/${userId}/viewprofile`} className="text-right w-full px-4 py-3 mt-0 no-underline block text-black transition bg-slate-100 hover:bg-slate-300 duration-200" onClick={closeDropdown}>Settings</Link>

          <div className="text-right w-full px-4 py-3 mt-0 no-underline block text-black transition bg-slate-100 hover:bg-slate-300 duration-200" onClick={closeDropdown}>Vouchers</div>

          <Logout/>
        </div>
      )}
    </div>
  );
};

export default UserDropDown;
