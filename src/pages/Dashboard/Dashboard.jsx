import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { crmService } from '../../services/crmService';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [dashboardStats, recentActivities] = await Promise.all([
          crmService.getDashboardStats(),
          crmService.getActivities(8)
        ]);
        setStats(dashboardStats);
        setActivities(recentActivities);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatCurrency = (amount) => {
    if (amount >= 1000000000) {
      return `$${(amount / 1000000000).toFixed(1)}B`;
    }
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'deal_won': return '🎉';
      case 'deal_created': return '✨';
      case 'meeting': return '📅';
      case 'email': return '📧';
      case 'call': return '📞';
      case 'contact_added': return '👤';
      default: return '📌';
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'deal_won': return 'success';
      case 'deal_created': return 'primary';
      case 'meeting': return 'info';
      case 'email': return 'warning';
      case 'call': return 'info';
      case 'contact_added': return 'neutral';
      default: return 'neutral';
    }
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="dashboard__header">
          <div className="skeleton" style={{ width: '300px', height: '40px', marginBottom: '8px' }} />
          <div className="skeleton" style={{ width: '200px', height: '24px' }} />
        </div>
        <div className="dashboard__stats">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="stat-card">
              <div className="skeleton" style={{ width: '100%', height: '100px' }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <div className="error-icon">⚠️</div>
        <h2>Unable to load dashboard</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="btn btn--primary">
          Try Again
        </button>
      </div>
    );
  }

  const pipelineTotal = 
    stats.pipeline.qualification.reduce((sum, d) => sum + d.value, 0) +
    stats.pipeline.proposal.reduce((sum, d) => sum + d.value, 0) +
    stats.pipeline.negotiation.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard__header">
        <div className="dashboard__header-content">
          <h1>Dashboard</h1>
          <p>Welcome back! Here's what's happening with your business.</p>
        </div>
        <div className="dashboard__header-actions">
          <button className="btn btn--outline">
            <span>📊</span> Export Report
          </button>
          <button className="btn btn--primary">
            <span>➕</span> New Deal
          </button>
        </div>
      </div>

      {/* Main Stats */}
      <div className="dashboard__stats">
        <div className="stat-card stat-card--primary">
          <div className="stat-card__header">
            <div className="stat-card__icon stat-card__icon--primary">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <span className="stat-card__trend stat-card__trend--up">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                <polyline points="17 6 23 6 23 12" />
              </svg>
              12.5%
            </span>
          </div>
          <div className="stat-card__value">{formatCurrency(stats.wonDealValue)}</div>
          <div className="stat-card__label">Revenue Won</div>
          <div className="stat-card__sublabel">from {stats.wonDeals} closed deals</div>
        </div>

        <div className="stat-card">
          <div className="stat-card__header">
            <div className="stat-card__icon stat-card__icon--info">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </div>
            <span className="stat-card__trend stat-card__trend--up">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                <polyline points="17 6 23 6 23 12" />
              </svg>
              8.2%
            </span>
          </div>
          <div className="stat-card__value">{formatCurrency(pipelineTotal)}</div>
          <div className="stat-card__label">Pipeline Value</div>
          <div className="stat-card__sublabel">{stats.activeDeals} active deals</div>
        </div>

        <div className="stat-card">
          <div className="stat-card__header">
            <div className="stat-card__icon stat-card__icon--success">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
          </div>
          <div className="stat-card__value">{stats.activeCustomers}</div>
          <div className="stat-card__label">Active Customers</div>
          <div className="stat-card__sublabel">{stats.totalContacts} total contacts</div>
        </div>

        <div className="stat-card">
          <div className="stat-card__header">
            <div className="stat-card__icon stat-card__icon--warning">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
          </div>
          <div className="stat-card__value">{stats.conversionRate.toFixed(0)}%</div>
          <div className="stat-card__label">Win Rate</div>
          <div className="stat-card__sublabel">vs {stats.lostDeals} lost</div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="dashboard__grid">
        {/* Revenue Chart */}
        <div className="dashboard__card dashboard__card--chart">
          <div className="card__header">
            <h3>Revenue Trend</h3>
            <div className="card__header-actions">
              <button className="card__tab card__tab--active">6 Months</button>
              <button className="card__tab">1 Year</button>
            </div>
          </div>
          <div className="chart-container">
            <div className="chart-bars">
              {stats.monthlyRevenue.map((item, index) => (
                <div key={item.month} className="chart-bar-wrapper" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="chart-bar-value">{formatCurrency(item.value)}</div>
                  <div 
                    className="chart-bar" 
                    style={{ 
                      height: `${(item.value / Math.max(...stats.monthlyRevenue.map(m => m.value))) * 180}px` 
                    }}
                  />
                  <div className="chart-bar-label">{item.month}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pipeline */}
        <div className="dashboard__card dashboard__card--pipeline">
          <div className="card__header">
            <h3>Sales Pipeline</h3>
            <Link to="/deals" className="card__link">View All →</Link>
          </div>
          <div className="pipeline-stages">
            <div className="pipeline-stage">
              <div className="pipeline-stage__header">
                <span className="pipeline-stage__name">Qualification</span>
                <span className="pipeline-stage__count">{stats.pipeline.qualification.length}</span>
              </div>
              <div className="pipeline-stage__bar">
                <div 
                  className="pipeline-stage__fill pipeline-stage__fill--qualification"
                  style={{ width: `${(stats.pipeline.qualification.length / stats.activeDeals) * 100}%` }}
                />
              </div>
              <div className="pipeline-stage__value">
                {formatCurrency(stats.pipeline.qualification.reduce((sum, d) => sum + d.value, 0))}
              </div>
            </div>
            
            <div className="pipeline-stage">
              <div className="pipeline-stage__header">
                <span className="pipeline-stage__name">Proposal</span>
                <span className="pipeline-stage__count">{stats.pipeline.proposal.length}</span>
              </div>
              <div className="pipeline-stage__bar">
                <div 
                  className="pipeline-stage__fill pipeline-stage__fill--proposal"
                  style={{ width: `${(stats.pipeline.proposal.length / stats.activeDeals) * 100}%` }}
                />
              </div>
              <div className="pipeline-stage__value">
                {formatCurrency(stats.pipeline.proposal.reduce((sum, d) => sum + d.value, 0))}
              </div>
            </div>
            
            <div className="pipeline-stage">
              <div className="pipeline-stage__header">
                <span className="pipeline-stage__name">Negotiation</span>
                <span className="pipeline-stage__count">{stats.pipeline.negotiation.length}</span>
              </div>
              <div className="pipeline-stage__bar">
                <div 
                  className="pipeline-stage__fill pipeline-stage__fill--negotiation"
                  style={{ width: `${(stats.pipeline.negotiation.length / stats.activeDeals) * 100}%` }}
                />
              </div>
              <div className="pipeline-stage__value">
                {formatCurrency(stats.pipeline.negotiation.reduce((sum, d) => sum + d.value, 0))}
              </div>
            </div>
          </div>

          <div className="pipeline-summary">
            <div className="pipeline-summary__item">
              <span className="pipeline-summary__label">Won Deals</span>
              <span className="pipeline-summary__value pipeline-summary__value--success">{stats.wonDeals}</span>
            </div>
            <div className="pipeline-summary__item">
              <span className="pipeline-summary__label">Lost Deals</span>
              <span className="pipeline-summary__value pipeline-summary__value--danger">{stats.lostDeals}</span>
            </div>
          </div>
        </div>

        {/* Top Customers */}
        <div className="dashboard__card dashboard__card--customers">
          <div className="card__header">
            <h3>Top Customers</h3>
            <Link to="/customers" className="card__link">View All →</Link>
          </div>
          <div className="top-customers">
            {stats.topCustomers.map((customer, index) => (
              <div key={customer.id} className="top-customer" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="top-customer__rank">#{index + 1}</div>
                <div className="top-customer__avatar">
                  <img 
                    src={customer.logo} 
                    alt={customer.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(customer.name)}&background=6366f1&color=fff`;
                    }}
                  />
                </div>
                <div className="top-customer__info">
                  <div className="top-customer__name">{customer.name}</div>
                  <div className="top-customer__industry">{customer.industry}</div>
                </div>
                <div className="top-customer__value">{formatCurrency(customer.dealValue)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="dashboard__card dashboard__card--activity">
          <div className="card__header">
            <h3>Recent Activity</h3>
            <button className="card__link">View All →</button>
          </div>
          <div className="activity-feed">
            {activities.map((activity, index) => (
              <div 
                key={activity.id} 
                className="activity-item"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className={`activity-item__icon activity-item__icon--${getActivityColor(activity.type)}`}>
                  {getActivityIcon(activity.type)}
                </div>
                <div className="activity-item__content">
                  <div className="activity-item__title">{activity.title}</div>
                  <div className="activity-item__description">{activity.description}</div>
                  {activity.value && (
                    <div className="activity-item__value">{formatCurrency(activity.value)}</div>
                  )}
                </div>
                <div className="activity-item__time">{getTimeAgo(activity.timestamp)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="dashboard__quick-actions">
        <h3>Quick Actions</h3>
        <div className="quick-actions__grid">
          <Link to="/customers" className="quick-action">
            <div className="quick-action__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <line x1="19" y1="8" x2="19" y2="14" />
                <line x1="22" y1="11" x2="16" y2="11" />
              </svg>
            </div>
            <span>Add Customer</span>
          </Link>
          <Link to="/contacts" className="quick-action">
            <div className="quick-action__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <span>Add Contact</span>
          </Link>
          <Link to="/deals" className="quick-action">
            <div className="quick-action__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
            </div>
            <span>Create Deal</span>
          </Link>
          <button className="quick-action">
            <div className="quick-action__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </div>
            <span>Generate Report</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
