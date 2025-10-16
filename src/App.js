import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Dashboard from './pages/Dashboard/Dashboard';
import Customers from './pages/Customers/Customers';
import './styles/globals.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <main className="app__main">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/contacts" element={<div className="page-placeholder"><h1>Contacts</h1><p>Coming soon...</p></div>} />
            <Route path="/deals" element={<div className="page-placeholder"><h1>Deals</h1><p>Coming soon...</p></div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;


