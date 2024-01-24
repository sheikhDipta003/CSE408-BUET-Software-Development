import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import '../css/UserDropDown.css';

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
          <div><Link to="/" className="dropdown-item">Homepage</Link></div>
          <div className="dropdown-item">Wishlist</div>
          <div><Link to="/user/1/viewprofile" className="dropdown-item">Settings</Link></div>
          <div className="dropdown-item">Vouchers</div>
          <div className="dropdown-item" style={{"color":"red"}}>Logout</div>
        </div>
      )}
    </div>
  );
};

export default UserDropDown;
