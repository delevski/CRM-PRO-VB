# Performance Optimization Guide

## Table of Contents
- [Performance Fundamentals](#performance-fundamentals)
- [React Performance Optimization](#react-performance-optimization)
- [Bundle Optimization](#bundle-optimization)
- [Image and Asset Optimization](#image-and-asset-optimization)
- [Network Optimization](#network-optimization)
- [Rendering Optimization](#rendering-optimization)
- [Memory Management](#memory-management)
- [Monitoring and Profiling](#monitoring-and-profiling)

## Performance Fundamentals

### 1. Core Web Vitals
```javascript
// ✅ Good: Monitor Core Web Vitals
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric) {
  // Send to your analytics service
  console.log(metric);
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

### 2. Performance Budget
```javascript
// ✅ Good: Set performance budgets
const performanceBudget = {
  // Bundle sizes
  js: '250kb',
  css: '50kb',
  images: '500kb',
  
  // Core Web Vitals
  lcp: 2500, // ms
  fid: 100,  // ms
  cls: 0.1,  // score
  
  // Other metrics
  tti: 3800, // ms
  tbt: 200   // ms
};
```

## React Performance Optimization

### 1. Component Memoization
```jsx
// ✅ Good: Use React.memo for expensive components
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

// ✅ Good: Custom comparison function for complex props
const UserCard = React.memo(({ user, settings }) => {
  return (
    <div>
      <h3>{user.name}</h3>
      <p>{user.email}</p>
    </div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.user.id === nextProps.user.id &&
    prevProps.user.name === nextProps.user.name &&
    prevProps.user.email === nextProps.user.email &&
    prevProps.settings.theme === nextProps.settings.theme
  );
});
```

### 2. Hook Optimization
```jsx
// ✅ Good: Optimize useCallback and useMemo
const ParentComponent = () => {
  const [count, setCount] = useState(0);
  const [items, setItems] = useState([]);
  
  // Memoize expensive calculations
  const expensiveValue = useMemo(() => {
    return items.reduce((sum, item) => sum + item.value, 0);
  }, [items]);
  
  // Memoize callbacks passed to child components
  const handleItemClick = useCallback((id) => {
    setItems(prev => prev.filter(item => item.id !== id));
  }, []);
  
  // Memoize event handlers
  const handleIncrement = useCallback(() => {
    setCount(prev => prev + 1);
  }, []);
  
  return (
    <div>
      <ExpensiveChildComponent 
        items={items} 
        onItemClick={handleItemClick}
        totalValue={expensiveValue}
      />
      <button onClick={handleIncrement}>Count: {count}</button>
    </div>
  );
};

// ❌ Bad: Unnecessary memoization
const BadComponent = () => {
  const [count, setCount] = useState(0);
  
  // Don't memoize simple values
  const simpleValue = useMemo(() => count * 2, [count]);
  
  // Don't memoize simple callbacks
  const simpleCallback = useCallback(() => {
    console.log('clicked');
  }, []);
  
  return <div>{simpleValue}</div>;
};
```

### 3. Virtual Scrolling
```jsx
// ✅ Good: Virtual scrolling for large lists
import { FixedSizeList as List } from 'react-window';

const VirtualizedList = ({ items }) => {
  const Row = ({ index, style }) => (
    <div style={style}>
      <Item item={items[index]} />
    </div>
  );
  
  return (
    <List
      height={600}
      itemCount={items.length}
      itemSize={80}
      width="100%"
    >
      {Row}
    </List>
  );
};

// ✅ Good: Dynamic virtual scrolling
import { VariableSizeList as List } from 'react-window';

const DynamicVirtualizedList = ({ items }) => {
  const getItemSize = (index) => {
    return items[index].height || 80;
  };
  
  const Row = ({ index, style }) => (
    <div style={style}>
      <Item item={items[index]} />
    </div>
  );
  
  return (
    <List
      height={600}
      itemCount={items.length}
      itemSize={getItemSize}
      width="100%"
    >
      {Row}
    </List>
  );
};
```

### 4. Code Splitting
```jsx
// ✅ Good: Route-based code splitting
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));

const App = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

// ✅ Good: Component-based code splitting
const HeavyComponent = lazy(() => import('./HeavyComponent'));

const ParentComponent = ({ showHeavy }) => {
  return (
    <div>
      <LightComponent />
      {showHeavy && (
        <Suspense fallback={<div>Loading heavy component...</div>}>
          <HeavyComponent />
        </Suspense>
      )}
    </div>
  );
};
```

## Bundle Optimization

### 1. Webpack Configuration
```javascript
// ✅ Good: Webpack optimization config
const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'production',
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
        common: {
          name: 'common',
          minChunks: 2,
          chunks: 'all',
          enforce: true,
        },
      },
    },
    usedExports: true,
    sideEffects: false,
  },
  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.HashedModuleIdsPlugin(),
  ],
};
```

### 2. Tree Shaking
```javascript
// ✅ Good: Tree-shakable imports
// Import only what you need
import { debounce } from 'lodash/debounce';
import { format } from 'date-fns';

// ✅ Good: ES6 modules for tree shaking
export const utility1 = () => {};
export const utility2 = () => {};

// ❌ Bad: Import entire library
import _ from 'lodash';
import * as dateFns from 'date-fns';
```

### 3. Bundle Analysis
```javascript
// ✅ Good: Bundle analyzer configuration
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
      reportFilename: 'bundle-report.html',
    }),
  ],
};

// ✅ Good: Bundle size monitoring
const getBundleSize = () => {
  const fs = require('fs');
  const path = require('path');
  
  const bundlePath = path.join(__dirname, 'build/static/js');
  const files = fs.readdirSync(bundlePath);
  
  const sizes = files.map(file => {
    const filePath = path.join(bundlePath, file);
    const stats = fs.statSync(filePath);
    return {
      file,
      size: stats.size,
      sizeKB: Math.round(stats.size / 1024)
    };
  });
  
  return sizes;
};
```

## Image and Asset Optimization

### 1. Image Optimization
```jsx
// ✅ Good: Optimized image loading
import { useState } from 'react';

const OptimizedImage = ({ src, alt, ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  
  return (
    <div className="image-container">
      {!isLoaded && !hasError && (
        <div className="image-placeholder">Loading...</div>
      )}
      <img
        src={src}
        alt={alt}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        style={{ display: isLoaded ? 'block' : 'none' }}
        loading="lazy"
        {...props}
      />
      {hasError && (
        <div className="image-error">Failed to load image</div>
      )}
    </div>
  );
};

// ✅ Good: Responsive images
const ResponsiveImage = ({ src, alt, sizes, ...props }) => {
  const srcSet = sizes
    .map(size => `${src}?w=${size} ${size}w`)
    .join(', ');
  
  return (
    <img
      src={src}
      srcSet={srcSet}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      alt={alt}
      loading="lazy"
      {...props}
    />
  );
};
```

### 2. Font Optimization
```css
/* ✅ Good: Font optimization */
@font-face {
  font-family: 'CustomFont';
  src: url('font.woff2') format('woff2'),
       url('font.woff') format('woff');
  font-display: swap; /* Improves loading performance */
  font-weight: 400;
  font-style: normal;
}

/* ✅ Good: Preload critical fonts */
<link 
  rel="preload" 
  href="/fonts/custom-font.woff2" 
  as="font" 
  type="font/woff2" 
  crossorigin
/>
```

### 3. Asset Preloading
```html
<!-- ✅ Good: Preload critical resources -->
<link rel="preload" href="/critical.css" as="style">
<link rel="preload" href="/hero-image.jpg" as="image">
<link rel="preload" href="/api/data" as="fetch" crossorigin>

<!-- ✅ Good: Prefetch non-critical resources -->
<link rel="prefetch" href="/next-page.css">
<link rel="prefetch" href="/next-page.js">
```

## Network Optimization

### 1. HTTP/2 and Compression
```javascript
// ✅ Good: Enable compression
const compression = require('compression');
const express = require('express');

const app = express();

// Enable gzip compression
app.use(compression({
  level: 6,
  threshold: 1024,
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  }
}));

// ✅ Good: Cache headers
app.use((req, res, next) => {
  if (req.url.match(/\.(css|js|png|jpg|jpeg|gif|ico|svg)$/)) {
    res.setHeader('Cache-Control', 'public, max-age=31536000');
  }
  next();
});
```

### 2. API Optimization
```javascript
// ✅ Good: Request batching
const batchRequests = async (requests) => {
  const batchSize = 10;
  const results = [];
  
  for (let i = 0; i < requests.length; i += batchSize) {
    const batch = requests.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map(request => fetch(request.url, request.options))
    );
    results.push(...batchResults);
  }
  
  return results;
};

// ✅ Good: Request deduplication
const requestCache = new Map();

const deduplicatedFetch = async (url, options) => {
  const key = `${url}-${JSON.stringify(options)}`;
  
  if (requestCache.has(key)) {
    return requestCache.get(key);
  }
  
  const promise = fetch(url, options);
  requestCache.set(key, promise);
  
  // Clean up cache after request completes
  promise.finally(() => {
    requestCache.delete(key);
  });
  
  return promise;
};
```

### 3. Service Worker Caching
```javascript
// ✅ Good: Service worker for caching
const CACHE_NAME = 'app-cache-v1';
const urlsToCache = [
  '/',
  '/static/css/main.css',
  '/static/js/main.js',
  '/static/media/logo.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
  );
});
```

## Rendering Optimization

### 1. Avoid Unnecessary Re-renders
```jsx
// ✅ Good: Prevent unnecessary re-renders
const ExpensiveComponent = ({ data, onUpdate }) => {
  // Use useMemo for expensive calculations
  const processedData = useMemo(() => {
    return data.map(item => ({
      ...item,
      processed: heavyComputation(item)
    }));
  }, [data]);
  
  // Use useCallback for event handlers
  const handleUpdate = useCallback((id, updates) => {
    onUpdate(id, updates);
  }, [onUpdate]);
  
  return (
    <div>
      {processedData.map(item => (
        <Item 
          key={item.id} 
          item={item} 
          onUpdate={handleUpdate}
        />
      ))}
    </div>
  );
};

// ❌ Bad: Causes unnecessary re-renders
const BadComponent = ({ data, onUpdate }) => {
  // This creates a new object on every render
  const processedData = data.map(item => ({
    ...item,
    processed: heavyComputation(item)
  }));
  
  // This creates a new function on every render
  const handleUpdate = (id, updates) => {
    onUpdate(id, updates);
  };
  
  return (
    <div>
      {processedData.map(item => (
        <Item 
          key={item.id} 
          item={item} 
          onUpdate={handleUpdate}
        />
      ))}
    </div>
  );
};
```

### 2. Optimize List Rendering
```jsx
// ✅ Good: Optimized list rendering
const OptimizedList = ({ items }) => {
  const [visibleItems, setVisibleItems] = useState(items.slice(0, 20));
  const [loading, setLoading] = useState(false);
  
  const loadMore = useCallback(() => {
    if (loading) return;
    
    setLoading(true);
    
    // Simulate async loading
    setTimeout(() => {
      setVisibleItems(prev => [
        ...prev,
        ...items.slice(prev.length, prev.length + 20)
      ]);
      setLoading(false);
    }, 100);
  }, [items, loading]);
  
  return (
    <div>
      {visibleItems.map(item => (
        <Item key={item.id} item={item} />
      ))}
      {visibleItems.length < items.length && (
        <button onClick={loadMore} disabled={loading}>
          {loading ? 'Loading...' : 'Load More'}
        </button>
      )}
    </div>
  );
};
```

### 3. Debouncing and Throttling
```jsx
// ✅ Good: Debounced search
import { debounce } from 'lodash/debounce';

const SearchComponent = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  
  const debouncedSearch = useCallback(
    debounce(async (searchQuery) => {
      if (searchQuery.length < 2) return;
      
      const response = await fetch(`/api/search?q=${searchQuery}`);
      const data = await response.json();
      setResults(data);
    }, 300),
    []
  );
  
  useEffect(() => {
    debouncedSearch(query);
  }, [query, debouncedSearch]);
  
  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />
      <div>
        {results.map(result => (
          <div key={result.id}>{result.title}</div>
        ))}
      </div>
    </div>
  );
};
```

## Memory Management

### 1. Cleanup Effects
```jsx
// ✅ Good: Proper cleanup in useEffect
const DataComponent = ({ userId }) => {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    let isCancelled = false;
    
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/users/${userId}`);
        const userData = await response.json();
        
        if (!isCancelled) {
          setData(userData);
        }
      } catch (error) {
        if (!isCancelled) {
          console.error('Failed to fetch data:', error);
        }
      }
    };
    
    fetchData();
    
    return () => {
      isCancelled = true;
    };
  }, [userId]);
  
  return <div>{data?.name}</div>;
};

// ✅ Good: Cleanup event listeners
const ScrollComponent = () => {
  useEffect(() => {
    const handleScroll = () => {
      // Handle scroll
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  return <div>Scroll component</div>;
};
```

### 2. Avoid Memory Leaks
```jsx
// ✅ Good: Avoid memory leaks
const TimerComponent = () => {
  const [time, setTime] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(prev => prev + 1);
    }, 1000);
    
    return () => {
      clearInterval(interval);
    };
  }, []);
  
  return <div>Time: {time}</div>;
};

// ❌ Bad: Memory leak
const BadTimerComponent = () => {
  const [time, setTime] = useState(0);
  
  useEffect(() => {
    setInterval(() => {
      setTime(prev => prev + 1);
    }, 1000);
    // Missing cleanup!
  }, []);
  
  return <div>Time: {time}</div>;
};
```

## Monitoring and Profiling

### 1. Performance Monitoring
```javascript
// ✅ Good: Performance monitoring
const performanceMonitor = {
  measureRenderTime: (componentName, renderFn) => {
    const start = performance.now();
    const result = renderFn();
    const end = performance.now();
    
    console.log(`${componentName} render time: ${end - start}ms`);
    return result;
  },
  
  measureAsyncOperation: async (operationName, operation) => {
    const start = performance.now();
    try {
      const result = await operation();
      const end = performance.now();
      console.log(`${operationName} completed in: ${end - start}ms`);
      return result;
    } catch (error) {
      const end = performance.now();
      console.log(`${operationName} failed after: ${end - start}ms`);
      throw error;
    }
  }
};

// Usage
const MyComponent = () => {
  return performanceMonitor.measureRenderTime('MyComponent', () => {
    return <div>My Component</div>;
  });
};
```

### 2. Bundle Size Monitoring
```javascript
// ✅ Good: Bundle size monitoring
const bundleAnalyzer = {
  analyzeBundle: () => {
    const fs = require('fs');
    const path = require('path');
    
    const buildPath = path.join(__dirname, 'build');
    const stats = JSON.parse(
      fs.readFileSync(path.join(buildPath, 'static/js/stats.json'))
    );
    
    const analysis = {
      totalSize: 0,
      chunks: [],
      warnings: []
    };
    
    stats.chunks.forEach(chunk => {
      const size = chunk.size;
      analysis.totalSize += size;
      analysis.chunks.push({
        name: chunk.names[0],
        size: size,
        sizeKB: Math.round(size / 1024)
      });
    });
    
    return analysis;
  }
};
```

### 3. Real User Monitoring
```javascript
// ✅ Good: Real User Monitoring
const rum = {
  trackPageLoad: () => {
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0];
      
      const metrics = {
        loadTime: navigation.loadEventEnd - navigation.loadEventStart,
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime,
        firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime
      };
      
      // Send to analytics
      console.log('Page load metrics:', metrics);
    });
  },
  
  trackUserInteraction: (eventType, element) => {
    const start = performance.now();
    
    return () => {
      const duration = performance.now() - start;
      console.log(`${eventType} interaction took ${duration}ms`);
    };
  }
};
```

## Performance Checklist

### Development Phase
- [ ] Use React DevTools Profiler to identify bottlenecks
- [ ] Implement code splitting for routes and heavy components
- [ ] Use React.memo, useMemo, and useCallback appropriately
- [ ] Optimize images and assets
- [ ] Implement virtual scrolling for large lists
- [ ] Use proper cleanup in useEffect hooks

### Build Phase
- [ ] Enable tree shaking and dead code elimination
- [ ] Configure bundle splitting
- [ ] Optimize images and assets
- [ ] Enable compression (gzip/brotli)
- [ ] Set proper cache headers

### Production Phase
- [ ] Monitor Core Web Vitals
- [ ] Track bundle sizes
- [ ] Monitor memory usage
- [ ] Set up performance budgets
- [ ] Implement error tracking and performance monitoring

This comprehensive performance optimization guide will help you build fast, efficient React applications that provide excellent user experiences.
