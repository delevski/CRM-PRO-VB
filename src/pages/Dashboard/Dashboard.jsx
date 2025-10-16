import React, { useState, useEffect } from 'react';
import { crmService } from '../../services/crmService';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const dashboardStats = await crmService.getDashboardStats();
        setStats(dashboardStats);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner" />
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <h2>Error loading dashboard</h2>
        <p>{error}</p>
      </div>
    );
  }

  const StatCard = ({ title, value, subtitle, icon, color = 'primary' }) => (
    <div className={`stat-card stat-card--${color}`}>
      <div className="stat-card__icon">
        {icon}
      </div>
      <div className="stat-card__content">
        <h3 className="stat-card__value">{value}</h3>
        <p className="stat-card__title">{title}</p>
        {subtitle && <p className="stat-card__subtitle">{subtitle}</p>}
      </div>
    </div>
  );

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value) => {
    return `${value.toFixed(1)}%`;
  };

  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <h1>CRM Dashboard</h1>
        <p>Welcome to your customer relationship management system</p>
      </div>

      <div className="dashboard__stats">
        <StatCard
          title="Total Customers"
          value={stats.totalCustomers}
          icon="👥"
          color="primary"
        />
        <StatCard
          title="Total Contacts"
          value={stats.totalContacts}
          icon="📇"
          color="info"
        />
        <StatCard
          title="Active Deals"
          value={stats.activeDeals}
          subtitle={`${stats.totalDeals} total`}
          icon="🤝"
          color="success"
        />
        <StatCard
          title="Deal Value"
          value={formatCurrency(stats.totalDealValue)}
          subtitle={`${stats.wonDeals} won`}
          icon="💰"
          color="warning"
        />
      </div>

      <div className="dashboard__metrics">
        <div className="metric-card">
          <h3>Conversion Rate</h3>
          <div className="metric-value">
            {formatPercentage(stats.conversionRate)}
          </div>
          <div className="metric-description">
            Deals closed successfully
          </div>
        </div>
        
        <div className="metric-card">
          <h3>Pipeline Health</h3>
          <div className="pipeline-status">
            <div className="pipeline-item">
              <span className="pipeline-stage">Prospecting</span>
              <span className="pipeline-count">
                {stats.totalDeals - stats.activeDeals}
              </span>
            </div>
            <div className="pipeline-item">
              <span className="pipeline-stage">Active</span>
              <span className="pipeline-count">{stats.activeDeals}</span>
            </div>
            <div className="pipeline-item">
              <span className="pipeline-stage">Won</span>
              <span className="pipeline-count">{stats.wonDeals}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard__actions">
        <h2>Quick Actions</h2>
        <div className="action-grid">
          <button className="action-button">
            <span className="action-icon">➕</span>
            <span className="action-text">Add Customer</span>
          </button>
          <button className="action-button">
            <span className="action-icon">📞</span>
            <span className="action-text">Add Contact</span>
          </button>
          <button className="action-button">
            <span className="action-icon">🤝</span>
            <span className="action-text">Create Deal</span>
          </button>
          <button className="action-button">
            <span className="action-icon">📊</span>
            <span className="action-text">View Reports</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


