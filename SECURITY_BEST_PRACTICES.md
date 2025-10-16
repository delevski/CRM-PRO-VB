# Security Best Practices

## Table of Contents
- [Security Fundamentals](#security-fundamentals)
- [Authentication and Authorization](#authentication-and-authorization)
- [Input Validation and Sanitization](#input-validation-and-sanitization)
- [XSS Prevention](#xss-prevention)
- [CSRF Protection](#csrf-protection)
- [Secure Data Handling](#secure-data-handling)
- [API Security](#api-security)
- [Dependency Security](#dependency-security)
- [Environment Security](#environment-security)
- [Security Monitoring](#security-monitoring)

## Security Fundamentals

### 1. Security-First Mindset
```javascript
// ✅ Good: Security-first approach
const validateAndSanitizeInput = (input) => {
  // Always validate input
  if (typeof input !== 'string') {
    throw new Error('Invalid input type');
  }
  
  // Sanitize input
  const sanitized = input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .substring(0, 100); // Limit length
  
  return sanitized;
};

// ❌ Bad: Trusting user input
const processUserInput = (input) => {
  // Directly using user input without validation
  return `<div>${input}</div>`;
};
```

### 2. Principle of Least Privilege
```javascript
// ✅ Good: Minimal permissions
const createUser = async (userData) => {
  // Only include necessary fields
  const allowedFields = ['name', 'email', 'password'];
  const sanitizedData = {};
  
  allowedFields.forEach(field => {
    if (userData[field]) {
      sanitizedData[field] = userData[field];
    }
  });
  
  return await userService.create(sanitizedData);
};

// ❌ Bad: Including all fields
const createUserBad = async (userData) => {
  // Including all fields without filtering
  return await userService.create(userData);
};
```

## Authentication and Authorization

### 1. Secure Authentication
```javascript
// ✅ Good: Secure authentication implementation
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

class AuthService {
  constructor() {
    this.secretKey = process.env.JWT_SECRET;
    this.saltRounds = 12;
  }
  
  async hashPassword(password) {
    // Validate password strength
    if (!this.isPasswordStrong(password)) {
      throw new Error('Password does not meet security requirements');
    }
    
    return await bcrypt.hash(password, this.saltRounds);
  }
  
  async verifyPassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }
  
  generateToken(user) {
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role
    };
    
    return jwt.sign(payload, this.secretKey, {
      expiresIn: '1h',
      issuer: 'your-app',
      audience: 'your-app-users'
    });
  }
  
  verifyToken(token) {
    try {
      return jwt.verify(token, this.secretKey);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
  
  isPasswordStrong(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return password.length >= minLength && 
           hasUpperCase && 
           hasLowerCase && 
           hasNumbers && 
           hasSpecialChar;
  }
}
```

### 2. Authorization Middleware
```javascript
// ✅ Good: Role-based authorization
const requireAuth = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    
    next();
  };
};

// Usage
app.get('/admin/users', requireAuth, requireRole(['admin']), getUsers);
```

### 3. Session Management
```javascript
// ✅ Good: Secure session configuration
const sessionConfig = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    httpOnly: true, // Prevent XSS
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'strict' // CSRF protection
  },
  store: new RedisStore({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD
  })
};

app.use(session(sessionConfig));
```

## Input Validation and Sanitization

### 1. Input Validation
```javascript
// ✅ Good: Comprehensive input validation
import Joi from 'joi';

const userSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(50)
    .pattern(/^[a-zA-Z\s]+$/)
    .required(),
  email: Joi.string()
    .email()
    .max(100)
    .required(),
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .required(),
  age: Joi.number()
    .integer()
    .min(13)
    .max(120)
    .optional()
});

const validateUser = (req, res, next) => {
  const { error, value } = userSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      error: 'Validation failed',
      details: error.details.map(detail => detail.message)
    });
  }
  
  req.validatedData = value;
  next();
};

// Usage
app.post('/users', validateUser, createUser);
```

### 2. SQL Injection Prevention
```javascript
// ✅ Good: Parameterized queries
const getUserById = async (userId) => {
  // Using parameterized queries
  const query = 'SELECT * FROM users WHERE id = ?';
  const result = await db.query(query, [userId]);
  return result[0];
};

// ✅ Good: Using ORM with parameterized queries
const getUserByEmail = async (email) => {
  return await User.findOne({
    where: { email: email }
  });
};

// ❌ Bad: String concatenation (vulnerable to SQL injection)
const getUserByIdBad = async (userId) => {
  const query = `SELECT * FROM users WHERE id = ${userId}`;
  return await db.query(query);
};
```

### 3. NoSQL Injection Prevention
```javascript
// ✅ Good: Safe MongoDB queries
const getUserByEmail = async (email) => {
  // Using parameterized queries
  return await User.findOne({ email: email });
};

// ✅ Good: Input sanitization for MongoDB
const searchUsers = async (searchTerm) => {
  // Sanitize search term
  const sanitizedTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  
  return await User.find({
    $or: [
      { name: { $regex: sanitizedTerm, $options: 'i' } },
      { email: { $regex: sanitizedTerm, $options: 'i' } }
    ]
  });
};

// ❌ Bad: Direct user input in query
const searchUsersBad = async (searchTerm) => {
  // Vulnerable to NoSQL injection
  return await User.find({
    $where: `this.name.includes('${searchTerm}')`
  });
};
```

## XSS Prevention

### 1. Output Encoding
```jsx
// ✅ Good: React automatically escapes content
const UserProfile = ({ user }) => {
  return (
    <div>
      <h2>{user.name}</h2> {/* Automatically escaped */}
      <p>{user.bio}</p>   {/* Automatically escaped */}
    </div>
  );
};

// ✅ Good: Using dangerouslySetInnerHTML safely
const SafeHTMLContent = ({ content }) => {
  const sanitizedContent = DOMPurify.sanitize(content);
  
  return (
    <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
  );
};

// ❌ Bad: Direct HTML injection
const UnsafeComponent = ({ userInput }) => {
  return <div dangerouslySetInnerHTML={{ __html: userInput }} />;
};
```

### 2. Content Security Policy
```html
<!-- ✅ Good: Strict CSP header -->
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline'; 
               style-src 'self' 'unsafe-inline'; 
               img-src 'self' data: https:; 
               connect-src 'self' https://api.example.com;">

<!-- ✅ Good: Nonce-based CSP -->
<meta http-equiv="Content-Security-Policy" 
      content="script-src 'self' 'nonce-{random-nonce}'; 
               style-src 'self' 'nonce-{random-nonce}';">
```

### 3. Input Sanitization
```javascript
// ✅ Good: Input sanitization
import DOMPurify from 'dompurify';

const sanitizeInput = (input) => {
  if (typeof input !== 'string') {
    return '';
  }
  
  // Remove potentially dangerous characters
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong'],
    ALLOWED_ATTR: []
  });
};

const processUserInput = (userInput) => {
  const sanitized = sanitizeInput(userInput);
  return sanitized;
};
```

## CSRF Protection

### 1. CSRF Tokens
```javascript
// ✅ Good: CSRF token implementation
import csrf from 'csurf';

// Generate CSRF token
app.use(csrf({
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  }
}));

// Middleware to add CSRF token to responses
app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
});

// Protect routes
app.post('/api/users', csrfProtection, createUser);
```

### 2. SameSite Cookies
```javascript
// ✅ Good: SameSite cookie configuration
const cookieConfig = {
  secure: process.env.NODE_ENV === 'production',
  httpOnly: true,
  sameSite: 'strict', // Prevents CSRF
  maxAge: 24 * 60 * 60 * 1000
};

app.use(session({
  secret: process.env.SESSION_SECRET,
  cookie: cookieConfig
}));
```

## Secure Data Handling

### 1. Data Encryption
```javascript
// ✅ Good: Data encryption
import crypto from 'crypto';

class EncryptionService {
  constructor() {
    this.algorithm = 'aes-256-gcm';
    this.key = crypto.scryptSync(process.env.ENCRYPTION_KEY, 'salt', 32);
  }
  
  encrypt(text) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher(this.algorithm, this.key);
    cipher.setAAD(Buffer.from('additional-data'));
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    
    return {
      encrypted,
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex')
    };
  }
  
  decrypt(encryptedData) {
    const decipher = crypto.createDecipher(this.algorithm, this.key);
    decipher.setAAD(Buffer.from('additional-data'));
    decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'hex'));
    
    let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }
}
```

### 2. Secure Password Storage
```javascript
// ✅ Good: Secure password hashing
import bcrypt from 'bcrypt';
import crypto from 'crypto';

class PasswordService {
  constructor() {
    this.saltRounds = 12;
  }
  
  async hashPassword(password) {
    // Generate random salt
    const salt = await bcrypt.genSalt(this.saltRounds);
    
    // Hash password with salt
    const hashedPassword = await bcrypt.hash(password, salt);
    
    return hashedPassword;
  }
  
  async verifyPassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }
  
  generateSecurePassword() {
    const length = 16;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    
    return password;
  }
}
```

### 3. Sensitive Data Handling
```javascript
// ✅ Good: Sensitive data handling
class SensitiveDataService {
  constructor() {
    this.encryptionService = new EncryptionService();
  }
  
  storeSensitiveData(data) {
    // Only store necessary data
    const sanitizedData = this.sanitizeData(data);
    
    // Encrypt sensitive fields
    const encryptedData = {
      ...sanitizedData,
      ssn: this.encryptionService.encrypt(sanitizedData.ssn),
      creditCard: this.encryptionService.encrypt(sanitizedData.creditCard)
    };
    
    return encryptedData;
  }
  
  sanitizeData(data) {
    // Remove unnecessary fields
    const allowedFields = ['name', 'email', 'ssn', 'creditCard'];
    const sanitized = {};
    
    allowedFields.forEach(field => {
      if (data[field]) {
        sanitized[field] = data[field];
      }
    });
    
    return sanitized;
  }
  
  logSensitiveData(data) {
    // Never log sensitive data
    const safeData = { ...data };
    delete safeData.password;
    delete safeData.ssn;
    delete safeData.creditCard;
    
    console.log('User data:', safeData);
  }
}
```

## API Security

### 1. Rate Limiting
```javascript
// ✅ Good: Rate limiting implementation
import rateLimit from 'express-rate-limit';

const createRateLimit = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: { error: message },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      res.status(429).json({
        error: message,
        retryAfter: Math.round(windowMs / 1000)
      });
    }
  });
};

// Different limits for different endpoints
const authLimiter = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  5, // 5 attempts
  'Too many authentication attempts'
);

const apiLimiter = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  100, // 100 requests
  'Too many API requests'
);

// Usage
app.use('/api/auth', authLimiter);
app.use('/api', apiLimiter);
```

### 2. API Input Validation
```javascript
// ✅ Good: API input validation
const validateApiInput = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        error: 'Invalid input',
        details: error.details.map(detail => detail.message)
      });
    }
    
    req.validatedData = value;
    next();
  };
};

const userCreateSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required()
});

app.post('/api/users', validateApiInput(userCreateSchema), createUser);
```

### 3. API Authentication
```javascript
// ✅ Good: API authentication
const authenticateApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey) {
    return res.status(401).json({ error: 'API key required' });
  }
  
  // Validate API key
  if (!isValidApiKey(apiKey)) {
    return res.status(401).json({ error: 'Invalid API key' });
  }
  
  req.apiKey = apiKey;
  next();
};

const isValidApiKey = (apiKey) => {
  // Implement API key validation logic
  return apiKey === process.env.VALID_API_KEY;
};
```

## Dependency Security

### 1. Dependency Scanning
```javascript
// ✅ Good: Package.json with security considerations
{
  "scripts": {
    "audit": "npm audit",
    "audit:fix": "npm audit fix",
    "security-check": "npm audit --audit-level=moderate"
  },
  "devDependencies": {
    "npm-audit": "^1.0.0"
  }
}

// ✅ Good: Automated security scanning
const securityCheck = () => {
  const { execSync } = require('child_process');
  
  try {
    execSync('npm audit --audit-level=moderate', { stdio: 'inherit' });
    console.log('Security audit passed');
  } catch (error) {
    console.error('Security audit failed:', error.message);
    process.exit(1);
  }
};
```

### 2. Dependency Management
```javascript
// ✅ Good: Secure dependency management
const secureDependencies = {
  // Use specific versions
  'express': '^4.18.2',
  'bcrypt': '^5.1.0',
  'jsonwebtoken': '^9.0.0',
  
  // Avoid deprecated packages
  // 'request': 'deprecated', // Use axios or fetch instead
  
  // Use trusted sources
  'lodash': '^4.17.21' // From npm registry
};
```

## Environment Security

### 1. Environment Variables
```javascript
// ✅ Good: Secure environment configuration
const config = {
  // Database
  database: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
  },
  
  // JWT
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '1h'
  },
  
  // API
  api: {
    key: process.env.API_KEY,
    baseUrl: process.env.API_BASE_URL
  }
};

// Validate required environment variables
const requiredEnvVars = [
  'DB_HOST',
  'DB_PASSWORD',
  'JWT_SECRET',
  'API_KEY'
];

requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
});
```

### 2. Secure Configuration
```javascript
// ✅ Good: Secure configuration management
class ConfigService {
  constructor() {
    this.config = this.loadConfig();
    this.validateConfig();
  }
  
  loadConfig() {
    return {
      nodeEnv: process.env.NODE_ENV || 'development',
      port: parseInt(process.env.PORT) || 3000,
      database: {
        url: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === 'production'
      },
      security: {
        corsOrigin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
        rateLimit: {
          windowMs: parseInt(process.env.RATE_LIMIT_WINDOW) || 900000,
          max: parseInt(process.env.RATE_LIMIT_MAX) || 100
        }
      }
    };
  }
  
  validateConfig() {
    if (this.config.nodeEnv === 'production') {
      if (!process.env.DATABASE_URL) {
        throw new Error('DATABASE_URL is required in production');
      }
      if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is required in production');
      }
    }
  }
}
```

## Security Monitoring

### 1. Security Logging
```javascript
// ✅ Good: Security event logging
class SecurityLogger {
  constructor() {
    this.logger = require('winston').createLogger({
      level: 'info',
      format: require('winston').format.combine(
        require('winston').format.timestamp(),
        require('winston').format.json()
      ),
      transports: [
        new require('winston').transports.File({ filename: 'security.log' })
      ]
    });
  }
  
  logSecurityEvent(event, details) {
    this.logger.info('Security Event', {
      event,
      details,
      timestamp: new Date().toISOString(),
      ip: details.ip,
      userAgent: details.userAgent
    });
  }
  
  logFailedLogin(ip, userAgent, email) {
    this.logSecurityEvent('failed_login', {
      ip,
      userAgent,
      email,
      severity: 'medium'
    });
  }
  
  logSuspiciousActivity(ip, userAgent, activity) {
    this.logSecurityEvent('suspicious_activity', {
      ip,
      userAgent,
      activity,
      severity: 'high'
    });
  }
}
```

### 2. Security Monitoring
```javascript
// ✅ Good: Security monitoring
class SecurityMonitor {
  constructor() {
    this.failedAttempts = new Map();
    this.suspiciousIPs = new Set();
  }
  
  trackFailedLogin(ip) {
    const attempts = this.failedAttempts.get(ip) || 0;
    this.failedAttempts.set(ip, attempts + 1);
    
    if (attempts + 1 >= 5) {
      this.suspiciousIPs.add(ip);
      this.alertSecurityTeam(ip, 'Multiple failed login attempts');
    }
  }
  
  isSuspiciousIP(ip) {
    return this.suspiciousIPs.has(ip);
  }
  
  alertSecurityTeam(ip, reason) {
    console.log(`Security Alert: ${reason} from IP ${ip}`);
    // Send alert to security team
  }
}
```

## Security Checklist

### Development Phase
- [ ] Implement input validation and sanitization
- [ ] Use parameterized queries to prevent SQL injection
- [ ] Implement proper authentication and authorization
- [ ] Use HTTPS in production
- [ ] Implement CSRF protection
- [ ] Sanitize user input to prevent XSS
- [ ] Use secure password hashing (bcrypt)
- [ ] Implement rate limiting
- [ ] Use secure session management
- [ ] Validate all API inputs

### Production Phase
- [ ] Enable security headers (CSP, HSTS, etc.)
- [ ] Use secure environment variables
- [ ] Implement security monitoring and logging
- [ ] Regular security audits
- [ ] Keep dependencies updated
- [ ] Use secure database connections
- [ ] Implement proper error handling
- [ ] Use secure cookies
- [ ] Implement API authentication
- [ ] Monitor for security vulnerabilities

### Ongoing Security
- [ ] Regular security updates
- [ ] Monitor security logs
- [ ] Conduct penetration testing
- [ ] Review and update security policies
- [ ] Train team on security best practices
- [ ] Monitor for new vulnerabilities
- [ ] Implement incident response procedures
- [ ] Regular backup and recovery testing

This comprehensive security guide will help you build secure React applications that protect both your users and your business from security threats.
