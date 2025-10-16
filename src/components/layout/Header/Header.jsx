import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="header">
      <div className="header__container">
        <div className="header__brand">
          <Link to="/" className="header__logo">
            <span className="header__logo-icon">📊</span>
            <span className="header__logo-text">CRM Pro</span>
          </Link>
        </div>

        <nav className="header__nav">
          <ul className="header__nav-list">
            <li className="header__nav-item">
              <Link 
                to="/" 
                className={`header__nav-link ${isActive('/') ? 'header__nav-link--active' : ''}`}
              >
                Dashboard
              </Link>
            </li>
            <li className="header__nav-item">
              <Link 
                to="/customers" 
                className={`header__nav-link ${isActive('/customers') ? 'header__nav-link--active' : ''}`}
              >
                Customers
              </Link>
            </li>
            <li className="header__nav-item">
              <Link 
                to="/contacts" 
                className={`header__nav-link ${isActive('/contacts') ? 'header__nav-link--active' : ''}`}
              >
                Contacts
              </Link>
            </li>
            <li className="header__nav-item">
              <Link 
                to="/deals" 
                className={`header__nav-link ${isActive('/deals') ? 'header__nav-link--active' : ''}`}
              >
                Deals
              </Link>
            </li>
          </ul>
        </nav>

        <div className="header__actions">
          <button className="header__action-button" aria-label="Notifications">
            🔔
          </button>
          <button className="header__action-button" aria-label="Settings">
            ⚙️
          </button>
          <div className="header__user">
            <span className="header__user-avatar">👤</span>
            <span className="header__user-name">Admin User</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;


