# React Development Best Practices

## Table of Contents
- [Component Design](#component-design)
- [State Management](#state-management)
- [Props and Data Flow](#props-and-data-flow)
- [Performance Optimization](#performance-optimization)
- [Code Organization](#code-organization)
- [Error Handling](#error-handling)
- [Accessibility](#accessibility)

## Component Design

### 1. Keep Components Small and Focused
```jsx
// ✅ Good: Single responsibility
const UserAvatar = ({ user, size = 'medium' }) => {
  return (
    <img 
      src={user.avatar} 
      alt={`${user.name}'s avatar`}
      className={`avatar avatar--${size}`}
    />
  );
};

// ❌ Bad: Multiple responsibilities
const UserProfile = ({ user }) => {
  return (
    <div>
      <img src={user.avatar} alt="avatar" />
      <h1>{user.name}</h1>
      <p>{user.bio}</p>
      <button onClick={() => sendEmail(user.email)}>Contact</button>
      <div>{user.posts.map(post => <Post key={post.id} post={post} />)}</div>
    </div>
  );
};
```

### 2. Use Functional Components with Hooks
```jsx
// ✅ Good: Modern functional component
const Counter = ({ initialValue = 0 }) => {
  const [count, setCount] = useState(initialValue);
  
  const increment = useCallback(() => {
    setCount(prev => prev + 1);
  }, []);
  
  return (
    <div>
      <span>{count}</span>
      <button onClick={increment}>+</button>
    </div>
  );
};

// ❌ Bad: Class component (unless you have specific needs)
class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: props.initialValue || 0 };
  }
  
  increment = () => {
    this.setState(prevState => ({ count: prevState.count + 1 }));
  }
  
  render() {
    return (
      <div>
        <span>{this.state.count}</span>
        <button onClick={this.increment}>+</button>
      </div>
    );
  }
}
```

### 3. Use Composition Over Inheritance
```jsx
// ✅ Good: Composition pattern
const Modal = ({ children, isOpen, onClose }) => {
  if (!isOpen) return null;
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

const UserModal = ({ user, isOpen, onClose }) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <h2>{user.name}</h2>
    <p>{user.email}</p>
  </Modal>
);
```

## State Management

### 1. Use Appropriate State Management
```jsx
// ✅ Good: Local state for component-specific data
const SearchInput = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  
  // Component-specific logic
  return <input value={query} onChange={e => setQuery(e.target.value)} />;
};

// ✅ Good: Context for shared state
const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// ✅ Good: External state management for complex apps
// Use Redux Toolkit, Zustand, or Jotai for complex state
```

### 2. Avoid Direct State Mutations
```jsx
// ✅ Good: Immutable updates
const TodoList = () => {
  const [todos, setTodos] = useState([]);
  
  const addTodo = (text) => {
    setTodos(prev => [...prev, { id: Date.now(), text, completed: false }]);
  };
  
  const toggleTodo = (id) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };
  
  // ❌ Bad: Direct mutation
  // todos.push(newTodo); // Don't do this!
};
```

## Props and Data Flow

### 1. Use PropTypes or TypeScript
```jsx
// ✅ Good: PropTypes for runtime validation
import PropTypes from 'prop-types';

const Button = ({ children, variant, size, onClick }) => {
  return (
    <button 
      className={`btn btn--${variant} btn--${size}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  onClick: PropTypes.func,
};

Button.defaultProps = {
  variant: 'primary',
  size: 'medium',
};
```

### 2. Destructure Props Appropriately
```jsx
// ✅ Good: Destructure only what you need
const UserCard = ({ user: { name, email, avatar }, onEdit }) => {
  return (
    <div className="user-card">
      <img src={avatar} alt={name} />
      <h3>{name}</h3>
      <p>{email}</p>
      <button onClick={() => onEdit(email)}>Edit</button>
    </div>
  );
};

// ❌ Bad: Destructuring everything
const UserCard = ({ user, onEdit, onDelete, onShare, ...otherProps }) => {
  // Using only user and onEdit, but destructuring everything
};
```

## Performance Optimization

### 1. Use React.memo for Expensive Components
```jsx
// ✅ Good: Memoize expensive components
const ExpensiveComponent = React.memo(({ data, onUpdate }) => {
  const processedData = useMemo(() => {
    return data.map(item => ({
      ...item,
      processed: heavyComputation(item)
    }));
  }, [data]);
  
  return (
    <div>
      {processedData.map(item => (
        <Item key={item.id} item={item} onUpdate={onUpdate} />
      ))}
    </div>
  );
});
```

### 2. Use useCallback and useMemo Appropriately
```jsx
// ✅ Good: Memoize callbacks passed to child components
const ParentComponent = () => {
  const [count, setCount] = useState(0);
  const [items, setItems] = useState([]);
  
  const handleItemClick = useCallback((id) => {
    setItems(prev => prev.filter(item => item.id !== id));
  }, []);
  
  const expensiveValue = useMemo(() => {
    return items.reduce((sum, item) => sum + item.value, 0);
  }, [items]);
  
  return (
    <div>
      <ExpensiveChildComponent 
        items={items} 
        onItemClick={handleItemClick}
        totalValue={expensiveValue}
      />
    </div>
  );
};
```

## Code Organization

### 1. File Structure
```
src/
├── components/
│   ├── common/
│   │   ├── Button/
│   │   │   ├── Button.jsx
│   │   │   ├── Button.css
│   │   │   └── index.js
│   │   └── Modal/
│   ├── features/
│   │   ├── auth/
│   │   └── dashboard/
├── hooks/
├── utils/
├── services/
├── constants/
└── types/
```

### 2. Custom Hooks for Reusable Logic
```jsx
// ✅ Good: Custom hook for API calls
const useApi = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(url);
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [url]);
  
  return { data, loading, error };
};

// Usage
const UserProfile = ({ userId }) => {
  const { data: user, loading, error } = useApi(`/api/users/${userId}`);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return <div>{user.name}</div>;
};
```

## Error Handling

### 1. Error Boundaries
```jsx
// ✅ Good: Error boundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Log to error reporting service
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h2>Something went wrong.</h2>
          <button onClick={() => this.setState({ hasError: false })}>
            Try again
          </button>
        </div>
      );
    }
    
    return this.props.children;
  }
}
```

### 2. Graceful Error Handling
```jsx
// ✅ Good: Handle errors gracefully
const DataComponent = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/data');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
        // Fallback to default data
        setData([]);
      }
    };
    
    fetchData();
  }, []);
  
  if (error) {
    return (
      <div className="error-message">
        <p>Failed to load data: {error}</p>
        <button onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }
  
  return <div>{/* Render data */}</div>;
};
```

## Accessibility

### 1. Semantic HTML and ARIA
```jsx
// ✅ Good: Accessible component
const AccessibleButton = ({ children, onClick, disabled, ariaLabel }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className="btn"
    >
      {children}
    </button>
  );
};

// ✅ Good: Accessible form
const AccessibleForm = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  
  return (
    <form>
      <label htmlFor="email-input">
        Email Address
      </label>
      <input
        id="email-input"
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        aria-describedby={error ? "email-error" : undefined}
        aria-invalid={!!error}
      />
      {error && (
        <div id="email-error" role="alert" className="error">
          {error}
        </div>
      )}
    </form>
  );
};
```

### 2. Keyboard Navigation
```jsx
// ✅ Good: Keyboard accessible component
const KeyboardAccessibleList = ({ items, onSelect }) => {
  const [focusedIndex, setFocusedIndex] = useState(0);
  
  const handleKeyDown = (e) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(prev => 
          prev < items.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(prev => 
          prev > 0 ? prev - 1 : items.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        onSelect(items[focusedIndex]);
        break;
    }
  };
  
  return (
    <ul 
      role="listbox" 
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {items.map((item, index) => (
        <li
          key={item.id}
          role="option"
          aria-selected={index === focusedIndex}
          className={index === focusedIndex ? 'focused' : ''}
        >
          {item.name}
        </li>
      ))}
    </ul>
  );
};
```

## Additional Best Practices

### 1. Consistent Naming Conventions
- Components: PascalCase (`UserProfile`)
- Variables/functions: camelCase (`getUserData`)
- Constants: UPPER_SNAKE_CASE (`API_BASE_URL`)
- Files: kebab-case (`user-profile.jsx`)

### 2. Avoid Common Pitfalls
- Don't use array index as key for dynamic lists
- Don't mutate props or state directly
- Don't forget to clean up subscriptions in useEffect
- Don't overuse useCallback/useMemo
- Don't ignore accessibility requirements

### 3. Testing Considerations
- Write testable components
- Use data-testid for testing
- Keep business logic separate from UI components
- Mock external dependencies properly

This guide provides a solid foundation for React development best practices. Remember to adapt these practices to your specific project needs and team conventions.
