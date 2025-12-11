import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const notifications = [
    { id: 1, title: 'New deal closed', message: 'Supabase - $185,000', time: '2h ago', unread: true },
    { id: 2, title: 'Meeting reminder', message: 'Stripe demo at 3 PM', time: '4h ago', unread: true },
    { id: 3, title: 'Task completed', message: 'Follow-up email sent', time: '1d ago', unread: false },
  ];

  return (
    <header className="header">
      <div className="header__container">
        {/* Logo */}
        <div className="header__brand">
          <Link to="/" className="header__logo">
            <div className="header__logo-icon">
              <svg viewBox="0 0 32 32" fill="none">
                <rect width="32" height="32" rx="8" fill="url(#logo-gradient)" />
                <path d="M8 16L14 10L20 16L14 22L8 16Z" fill="white" fillOpacity="0.9" />
                <path d="M14 16L20 10L26 16L20 22L14 16Z" fill="white" fillOpacity="0.6" />
                <defs>
                  <linearGradient id="logo-gradient" x1="0" y1="0" x2="32" y2="32">
                    <stop stopColor="#6366f1" />
                    <stop offset="1" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <span className="header__logo-text">Nexus CRM</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="header__nav">
          <ul className="header__nav-list">
            <li className="header__nav-item">
              <Link 
                to="/" 
                className={`header__nav-link ${isActive('/') ? 'header__nav-link--active' : ''}`}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="14" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                </svg>
                Dashboard
              </Link>
            </li>
            <li className="header__nav-item">
              <Link 
                to="/customers" 
                className={`header__nav-link ${isActive('/customers') ? 'header__nav-link--active' : ''}`}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                Customers
              </Link>
            </li>
            <li className="header__nav-item">
              <Link 
                to="/contacts" 
                className={`header__nav-link ${isActive('/contacts') ? 'header__nav-link--active' : ''}`}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                Contacts
              </Link>
            </li>
            <li className="header__nav-item">
              <Link 
                to="/deals" 
                className={`header__nav-link ${isActive('/deals') ? 'header__nav-link--active' : ''}`}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
                Deals
              </Link>
            </li>
          </ul>
        </nav>

        {/* Actions */}
        <div className="header__actions">
          {/* Search */}
          <div className="header__search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input type="text" placeholder="Search..." className="header__search-input" />
            <span className="header__search-shortcut">⌘K</span>
          </div>

          {/* Notifications */}
          <div className="header__notification-wrapper">
            <button 
              className="header__action-button"
              onClick={() => setShowNotifications(!showNotifications)}
              aria-label="Notifications"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <span className="header__notification-badge">2</span>
            </button>
            
            {showNotifications && (
              <div className="header__dropdown header__dropdown--notifications">
                <div className="header__dropdown-header">
                  <h4>Notifications</h4>
                  <button className="header__dropdown-action">Mark all read</button>
                </div>
                <div className="header__dropdown-content">
                  {notifications.map(notif => (
                    <div key={notif.id} className={`notification-item ${notif.unread ? 'notification-item--unread' : ''}`}>
                      <div className="notification-item__dot" />
                      <div className="notification-item__content">
                        <div className="notification-item__title">{notif.title}</div>
                        <div className="notification-item__message">{notif.message}</div>
                        <div className="notification-item__time">{notif.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="header__dropdown-footer">
                  <button>View all notifications</button>
                </div>
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="header__profile-wrapper">
            <button 
              className="header__profile"
              onClick={() => setShowProfile(!showProfile)}
            >
              <div className="header__avatar">
                <img 
                  src="https://ui-avatars.com/api/?name=Alex+Morgan&background=6366f1&color=fff" 
                  alt="Profile"
                />
              </div>
              <div className="header__user-info">
                <span className="header__user-name">Alex Morgan</span>
                <span className="header__user-role">Sales Director</span>
              </div>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="header__chevron">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {showProfile && (
              <div className="header__dropdown header__dropdown--profile">
                <div className="header__dropdown-content">
                  <button className="dropdown-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    My Profile
                  </button>
                  <button className="dropdown-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="3" />
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                    </svg>
                    Settings
                  </button>
                  <button className="dropdown-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                      <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                    Help & Support
                  </button>
                  <div className="dropdown-divider" />
                  <button className="dropdown-item dropdown-item--danger">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
