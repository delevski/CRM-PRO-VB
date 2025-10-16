# Code Style and Formatting Guidelines

## Table of Contents
- [General Principles](#general-principles)
- [JavaScript/React Style](#javascriptreact-style)
- [CSS/Styling Guidelines](#cssstyling-guidelines)
- [File Organization](#file-organization)
- [Naming Conventions](#naming-conventions)
- [Comments and Documentation](#comments-and-documentation)
- [Tools and Automation](#tools-and-automation)

## General Principles

### 1. Consistency is Key
- Follow established patterns throughout the codebase
- Use automated tools to enforce style rules
- Document exceptions and reasoning

### 2. Readability Over Cleverness
```javascript
// ✅ Good: Clear and readable
const isUserActive = user.status === 'active' && user.lastLogin > thirtyDaysAgo;

// ❌ Bad: Clever but hard to understand
const isUserActive = !!(user.status === 'active' & user.lastLogin > thirtyDaysAgo);
```

### 3. Self-Documenting Code
```javascript
// ✅ Good: Intent is clear from the code
const calculateTotalPrice = (items) => {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
};

// ❌ Bad: Requires comments to understand
const calc = (arr) => {
  // Calculate total price including quantity
  return arr.reduce((t, i) => t + i.p * i.q, 0);
};
```

## JavaScript/React Style

### 1. Variable Declarations
```javascript
// ✅ Good: Use const by default, let when reassignment needed
const API_BASE_URL = 'https://api.example.com';
const userPreferences = getUserPreferences();
let currentPage = 1;

// ❌ Bad: Using var
var userData = fetchUserData();
```

### 2. Function Declarations
```javascript
// ✅ Good: Arrow functions for callbacks and short functions
const handleClick = (event) => {
  event.preventDefault();
  doSomething();
};

// ✅ Good: Function declarations for main functions
function processUserData(userData) {
  return userData.map(user => ({
    ...user,
    displayName: `${user.firstName} ${user.lastName}`
  }));
}

// ✅ Good: Async/await over promises
const fetchUserData = async (userId) => {
  try {
    const response = await fetch(`/api/users/${userId}`);
    const userData = await response.json();
    return userData;
  } catch (error) {
    console.error('Failed to fetch user data:', error);
    throw error;
  }
};
```

### 3. Object and Array Handling
```javascript
// ✅ Good: Object destructuring
const { name, email, preferences } = user;
const { theme, language } = preferences;

// ✅ Good: Array destructuring
const [first, second, ...rest] = items;

// ✅ Good: Spread operator for immutability
const updatedUser = {
  ...user,
  lastLogin: new Date(),
  preferences: {
    ...user.preferences,
    theme: 'dark'
  }
};

// ✅ Good: Array methods
const activeUsers = users
  .filter(user => user.status === 'active')
  .map(user => ({
    id: user.id,
    name: user.name,
    email: user.email
  }))
  .sort((a, b) => a.name.localeCompare(b.name));
```

### 4. React Component Style
```jsx
// ✅ Good: Component structure
import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import './UserProfile.css';

const UserProfile = ({ 
  userId, 
  onEdit, 
  onDelete,
  className = '',
  ...otherProps 
}) => {
  // Hooks at the top
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Event handlers
  const handleEdit = useCallback(() => {
    onEdit(userId);
  }, [onEdit, userId]);

  const handleDelete = useCallback(() => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      onDelete(userId);
    }
  }, [onDelete, userId]);

  // Effects
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const userData = await fetchUserData(userId);
        setUser(userData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  // Early returns
  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!user) return <div className="not-found">User not found</div>;

  // Render
  return (
    <div className={`user-profile ${className}`} {...otherProps}>
      <div className="user-profile__header">
        <h2 className="user-profile__name">{user.name}</h2>
        <div className="user-profile__actions">
          <button 
            className="btn btn--primary"
            onClick={handleEdit}
            aria-label={`Edit ${user.name}`}
          >
            Edit
          </button>
          <button 
            className="btn btn--danger"
            onClick={handleDelete}
            aria-label={`Delete ${user.name}`}
          >
            Delete
          </button>
        </div>
      </div>
      <div className="user-profile__content">
        <p className="user-profile__email">{user.email}</p>
        <p className="user-profile__bio">{user.bio}</p>
      </div>
    </div>
  );
};

UserProfile.propTypes = {
  userId: PropTypes.string.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default UserProfile;
```

## CSS/Styling Guidelines

### 1. CSS Methodology - BEM (Block Element Modifier)
```css
/* ✅ Good: BEM naming convention */
.user-profile {
  padding: 1rem;
  border: 1px solid #ddd;
}

.user-profile__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-profile__name {
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0;
}

.user-profile__actions {
  display: flex;
  gap: 0.5rem;
}

.user-profile--compact {
  padding: 0.5rem;
}

.user-profile--compact .user-profile__name {
  font-size: 1.2rem;
}

/* ❌ Bad: Inconsistent naming */
.userProfile {
  padding: 1rem;
}

.userProfileHeader {
  display: flex;
}

.userProfileName {
  font-size: 1.5rem;
}
```

### 2. CSS Custom Properties (Variables)
```css
/* ✅ Good: Use CSS custom properties */
:root {
  /* Colors */
  --color-primary: #007bff;
  --color-secondary: #6c757d;
  --color-success: #28a745;
  --color-danger: #dc3545;
  --color-warning: #ffc107;
  
  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  
  /* Typography */
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  
  /* Layout */
  --border-radius: 0.25rem;
  --box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.btn {
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius);
  font-size: var(--font-size-base);
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn--primary {
  background-color: var(--color-primary);
  color: white;
}

.btn--primary:hover {
  background-color: color-mix(in srgb, var(--color-primary) 90%, black);
}
```

### 3. Responsive Design
```css
/* ✅ Good: Mobile-first approach */
.container {
  width: 100%;
  padding: var(--spacing-md);
}

@media (min-width: 768px) {
  .container {
    max-width: 750px;
    margin: 0 auto;
  }
}

@media (min-width: 992px) {
  .container {
    max-width: 970px;
  }
}

@media (min-width: 1200px) {
  .container {
    max-width: 1170px;
  }
}

/* ✅ Good: Flexible grid system */
.grid {
  display: grid;
  gap: var(--spacing-md);
  grid-template-columns: 1fr;
}

@media (min-width: 768px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 992px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

## File Organization

### 1. Directory Structure
```
src/
├── components/           # Reusable UI components
│   ├── common/          # Generic components (Button, Modal, etc.)
│   │   ├── Button/
│   │   │   ├── Button.jsx
│   │   │   ├── Button.css
│   │   │   ├── Button.test.js
│   │   │   └── index.js
│   │   └── Modal/
│   ├── forms/           # Form-specific components
│   └── layout/          # Layout components (Header, Footer, etc.)
├── pages/               # Page components
│   ├── Home/
│   ├── About/
│   └── Contact/
├── hooks/               # Custom React hooks
│   ├── useApi.js
│   ├── useLocalStorage.js
│   └── index.js
├── services/            # API and external services
│   ├── api.js
│   ├── auth.js
│   └── storage.js
├── utils/               # Utility functions
│   ├── helpers.js
│   ├── validators.js
│   └── constants.js
├── styles/              # Global styles
│   ├── globals.css
│   ├── variables.css
│   └── reset.css
└── assets/              # Static assets
    ├── images/
    ├── icons/
    └── fonts/
```

### 2. Import/Export Organization
```javascript
// ✅ Good: Organized imports
// External libraries
import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

// Internal components
import Button from '../common/Button';
import Modal from '../common/Modal';
import UserCard from '../UserCard';

// Utilities and services
import { formatDate } from '../../utils/helpers';
import { fetchUserData } from '../../services/api';

// Styles
import './UserProfile.css';

// ✅ Good: Named exports for utilities
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// ✅ Good: Default export for components
const UserProfile = ({ userId }) => {
  // Component implementation
};

export default UserProfile;
```

## Naming Conventions

### 1. Files and Directories
```
// ✅ Good: kebab-case for files and directories
user-profile.jsx
user-profile.css
user-profile.test.js
user-profile.stories.js

// ✅ Good: PascalCase for component files
UserProfile.jsx
UserProfile.css
UserProfile.test.js

// ✅ Good: camelCase for utility files
formatDate.js
validateEmail.js
apiHelpers.js
```

### 2. Variables and Functions
```javascript
// ✅ Good: camelCase for variables and functions
const userName = 'john_doe';
const isUserActive = true;
const getUserData = () => {};

// ✅ Good: UPPER_SNAKE_CASE for constants
const API_BASE_URL = 'https://api.example.com';
const MAX_RETRY_ATTEMPTS = 3;
const DEFAULT_TIMEOUT = 5000;

// ✅ Good: PascalCase for components and classes
const UserProfile = () => {};
class ApiService {}

// ✅ Good: Descriptive names
const handleUserLogin = () => {};
const validateUserInput = () => {};
const formatUserDisplayName = () => {};
```

### 3. CSS Classes
```css
/* ✅ Good: BEM methodology */
.user-profile {}
.user-profile__header {}
.user-profile__name {}
.user-profile--compact {}
.user-profile--loading {}

/* ✅ Good: Semantic class names */
.btn {}
.btn--primary {}
.btn--secondary {}
.btn--large {}
.btn--small {}

.form {}
.form__field {}
.form__label {}
.form__error {}
.form--inline {}
```

## Comments and Documentation

### 1. JSDoc for Functions
```javascript
/**
 * Formats a date string into a human-readable format
 * @param {string|Date} date - The date to format
 * @param {string} locale - The locale for formatting (default: 'en-US')
 * @param {Object} options - Additional formatting options
 * @returns {string} The formatted date string
 * @example
 * formatDate('2023-12-25', 'en-US') // Returns "December 25, 2023"
 * formatDate(new Date(), 'fr-FR') // Returns "25 décembre 2023"
 */
const formatDate = (date, locale = 'en-US', options = {}) => {
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options
  });
};
```

### 2. Component Documentation
```jsx
/**
 * UserProfile component displays user information with edit and delete actions
 * 
 * @component
 * @param {Object} props - Component props
 * @param {string} props.userId - Unique identifier for the user
 * @param {Function} props.onEdit - Callback function called when edit button is clicked
 * @param {Function} props.onDelete - Callback function called when delete button is clicked
 * @param {string} [props.className] - Additional CSS class names
 * @param {boolean} [props.showActions=true] - Whether to show action buttons
 * 
 * @example
 * <UserProfile 
 *   userId="123" 
 *   onEdit={(id) => console.log('Edit user:', id)}
 *   onDelete={(id) => console.log('Delete user:', id)}
 * />
 */
const UserProfile = ({ userId, onEdit, onDelete, className, showActions = true }) => {
  // Component implementation
};
```

### 3. Inline Comments
```javascript
// ✅ Good: Explain why, not what
const processUserData = (users) => {
  // Filter out inactive users to improve performance
  const activeUsers = users.filter(user => user.status === 'active');
  
  // Sort by last login date (most recent first)
  return activeUsers.sort((a, b) => new Date(b.lastLogin) - new Date(a.lastLogin));
};

// ✅ Good: Explain complex logic
const calculateDiscount = (price, userType, membershipYears) => {
  let discount = 0;
  
  // Base discount based on user type
  if (userType === 'premium') {
    discount = 0.15; // 15% for premium users
  } else if (userType === 'standard') {
    discount = 0.05; // 5% for standard users
  }
  
  // Additional discount for long-term members
  if (membershipYears >= 5) {
    discount += 0.05; // Extra 5% for 5+ year members
  }
  
  return Math.min(discount, 0.25); // Cap at 25% total discount
};
```

## Tools and Automation

### 1. ESLint Configuration
```json
{
  "extends": [
    "react-app",
    "react-app/jest"
  ],
  "rules": {
    "no-console": "warn",
    "no-unused-vars": "error",
    "prefer-const": "error",
    "no-var": "error",
    "react/prop-types": "error",
    "react/jsx-uses-react": "off",
    "react/react-in-jsx-scope": "off"
  }
}
```

### 2. Prettier Configuration
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "arrowParens": "avoid",
  "endOfLine": "lf"
}
```

### 3. Pre-commit Hooks
```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "src/**/*.{js,jsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "src/**/*.{css,scss}": [
      "prettier --write"
    ]
  }
}
```

This code style guide ensures consistency, readability, and maintainability across your React project. Remember to adapt these guidelines to your team's specific needs and preferences.
