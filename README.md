# CRM Pro Dashboard

A responsive CRM dashboard prototype for tracking sales activity, customers, and team performance. It demonstrates a clean business interface with reusable React components, dashboard metrics, navigation, testing infrastructure, and documented engineering standards.

## Features

- Sales dashboard with key business metrics and recent activity
- Responsive sidebar and top navigation
- Reusable UI components with PropTypes validation
- Client-side routing prepared for contacts and deals modules
- Unit and interaction tests with React Testing Library
- End-to-end test setup with Playwright
- Separate guides for code style, testing, performance, and security

## Stack

- React 18
- React Router
- Create React App
- date-fns, Lodash, and UUID
- React Testing Library
- Playwright

## Run locally

```bash
git clone https://github.com/delevski/CRM-PRO-VB.git
cd CRM-PRO-VB
npm install
npm start
```

The app opens at `http://localhost:3000`.

## Tests and quality checks

```bash
npm test
npm run test:coverage
npm run test:e2e
npm run lint
npm run build
```

## Documentation

- [React best practices](REACT_BEST_PRACTICES.md)
- [Code style guide](CODE_STYLE_GUIDE.md)
- [Testing best practices](TESTING_BEST_PRACTICES.md)
- [Performance optimization](PERFORMANCE_OPTIMIZATION.md)
- [Security best practices](SECURITY_BEST_PRACTICES.md)

## Project status

The dashboard is functional as a front-end demonstration. The contacts and deals routes are placeholders, and production use would require a backend, authentication, and persistent data storage.
