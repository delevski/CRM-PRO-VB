import React, { useState, useEffect } from 'react';
import { crmService } from '../../services/crmService';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import CustomerForm from './CustomerForm';
import './Customers.css';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTier, setFilterTier] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [viewMode, setViewMode] = useState('table');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const customersData = await crmService.getCustomers();
      setCustomers(customersData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCustomer = async (customerData) => {
    try {
      const newCustomer = await crmService.createCustomer(customerData);
      setCustomers(prev => [...prev, newCustomer]);
      setShowModal(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateCustomer = async (customerData) => {
    try {
      const updatedCustomer = await crmService.updateCustomer(editingCustomer.id, customerData);
      setCustomers(prev => prev.map(customer => 
        customer.id === editingCustomer.id ? updatedCustomer : customer
      ));
      setShowModal(false);
      setEditingCustomer(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteCustomer = async (customerId) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await crmService.deleteCustomer(customerId);
        setCustomers(prev => prev.filter(customer => customer.id !== customerId));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleEditCustomer = (customer) => {
    setEditingCustomer(customer);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCustomer(null);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return '-';
    if (amount >= 1000000000) {
      return `$${(amount / 1000000000).toFixed(1)}B`;
    }
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(0)}M`;
    }
    return `$${(amount / 1000).toFixed(0)}K`;
  };

  const filteredCustomers = customers
    .filter(customer => {
      const matchesSearch = 
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.industry.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesTier = filterTier === 'all' || customer.tier === filterTier;
      const matchesStatus = filterStatus === 'all' || customer.status === filterStatus;
      
      return matchesSearch && matchesTier && matchesStatus;
    })
    .sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      
      if (sortBy === 'revenue') {
        aVal = aVal || 0;
        bVal = bVal || 0;
      }
      
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      }
      return aVal < bVal ? 1 : -1;
    });

  const stats = {
    total: customers.length,
    active: customers.filter(c => c.status === 'active').length,
    enterprise: customers.filter(c => c.tier === 'enterprise').length,
    avgHealth: Math.round(customers.reduce((sum, c) => sum + (c.healthScore || 0), 0) / customers.length)
  };

  const getTierBadge = (tier) => {
    const classes = {
      enterprise: 'badge badge--primary',
      growth: 'badge badge--info',
      startup: 'badge badge--neutral'
    };
    return classes[tier] || 'badge badge--neutral';
  };

  const getHealthColor = (score) => {
    if (score >= 90) return 'health--excellent';
    if (score >= 75) return 'health--good';
    if (score >= 50) return 'health--warning';
    return 'health--danger';
  };

  if (loading) {
    return (
      <div className="customers">
        <div className="customers__header">
          <div className="skeleton" style={{ width: '200px', height: '40px' }} />
          <div className="skeleton" style={{ width: '150px', height: '40px' }} />
        </div>
        <div className="customers__stats">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="skeleton" style={{ height: '80px' }} />
          ))}
        </div>
        <div className="customers__table-wrapper">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="skeleton" style={{ height: '60px', marginBottom: '8px' }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="customers">
      {/* Header */}
      <div className="customers__header">
        <div className="customers__header-content">
          <h1>Customers</h1>
          <p>Manage and monitor your customer relationships</p>
        </div>
        <div className="customers__header-actions">
          <button className="btn btn--outline">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            Export
          </button>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Customer
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="customers__stats">
        <div className="stat-mini">
          <div className="stat-mini__value">{stats.total}</div>
          <div className="stat-mini__label">Total Customers</div>
        </div>
        <div className="stat-mini">
          <div className="stat-mini__value">{stats.active}</div>
          <div className="stat-mini__label">Active</div>
        </div>
        <div className="stat-mini">
          <div className="stat-mini__value">{stats.enterprise}</div>
          <div className="stat-mini__label">Enterprise</div>
        </div>
        <div className="stat-mini">
          <div className="stat-mini__value">{stats.avgHealth}%</div>
          <div className="stat-mini__label">Avg Health Score</div>
        </div>
      </div>

      {/* Filters */}
      <div className="customers__filters">
        <div className="customers__search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="customers__filter-group">
          <select 
            value={filterTier} 
            onChange={(e) => setFilterTier(e.target.value)}
            className="customers__select"
          >
            <option value="all">All Tiers</option>
            <option value="enterprise">Enterprise</option>
            <option value="growth">Growth</option>
            <option value="startup">Startup</option>
          </select>
          
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            className="customers__select"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="customers__view-toggle">
          <button 
            className={`view-btn ${viewMode === 'table' ? 'view-btn--active' : ''}`}
            onClick={() => setViewMode('table')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
          </button>
          <button 
            className={`view-btn ${viewMode === 'grid' ? 'view-btn--active' : ''}`}
            onClick={() => setViewMode('grid')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
          </button>
        </div>
      </div>

      {error && (
        <div className="customers__error">
          <p>Error: {error}</p>
          <Button variant="secondary" onClick={fetchCustomers}>Retry</Button>
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="customers__table-wrapper">
          <table className="customers__table">
            <thead>
              <tr>
                <th onClick={() => handleSort('name')} className="sortable">
                  Company
                  {sortBy === 'name' && (
                    <span className="sort-icon">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
                <th>Tier</th>
                <th onClick={() => handleSort('industry')} className="sortable">
                  Industry
                  {sortBy === 'industry' && (
                    <span className="sort-icon">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
                <th onClick={() => handleSort('revenue')} className="sortable">
                  Revenue
                  {sortBy === 'revenue' && (
                    <span className="sort-icon">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
                <th>Health</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer, index) => (
                <tr key={customer.id} style={{ animationDelay: `${index * 0.03}s` }}>
                  <td>
                    <div className="customer-cell">
                      <div className="customer-cell__avatar">
                        <img 
                          src={customer.logo} 
                          alt={customer.name}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(customer.name)}&background=6366f1&color=fff`;
                          }}
                        />
                      </div>
                      <div className="customer-cell__info">
                        <div className="customer-cell__name">{customer.name}</div>
                        <div className="customer-cell__email">{customer.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={getTierBadge(customer.tier)}>
                      {customer.tier}
                    </span>
                  </td>
                  <td className="text-muted">{customer.industry}</td>
                  <td className="text-semibold">{formatCurrency(customer.revenue)}</td>
                  <td>
                    <div className={`health-score ${getHealthColor(customer.healthScore)}`}>
                      <div className="health-score__bar">
                        <div 
                          className="health-score__fill" 
                          style={{ width: `${customer.healthScore}%` }}
                        />
                      </div>
                      <span className="health-score__value">{customer.healthScore}%</span>
                    </div>
                  </td>
                  <td>
                    <span className={`status-dot status-dot--${customer.status}`}>
                      {customer.status}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button 
                        className="table-action"
                        onClick={() => handleEditCustomer(customer)}
                        title="Edit"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                      <button 
                        className="table-action table-action--danger"
                        onClick={() => handleDeleteCustomer(customer.id)}
                        title="Delete"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredCustomers.length === 0 && (
            <div className="customers__empty">
              <div className="empty-icon">🔍</div>
              <p>No customers found matching your criteria</p>
              <Button variant="primary" onClick={() => setShowModal(true)}>
                Add Your First Customer
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="customers__grid">
          {filteredCustomers.map((customer, index) => (
            <div 
              key={customer.id} 
              className="customer-card"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="customer-card__header">
                <div className="customer-card__avatar">
                  <img 
                    src={customer.logo} 
                    alt={customer.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(customer.name)}&background=6366f1&color=fff`;
                    }}
                  />
                </div>
                <div className="customer-card__actions">
                  <button onClick={() => handleEditCustomer(customer)}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="1" />
                      <circle cx="19" cy="12" r="1" />
                      <circle cx="5" cy="12" r="1" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="customer-card__body">
                <h3>{customer.name}</h3>
                <p className="customer-card__industry">{customer.industry}</p>
                <div className="customer-card__meta">
                  <span className={getTierBadge(customer.tier)}>{customer.tier}</span>
                  <span className={`status-dot status-dot--${customer.status}`}>
                    {customer.status}
                  </span>
                </div>
              </div>
              
              <div className="customer-card__footer">
                <div className="customer-card__stat">
                  <span className="label">Revenue</span>
                  <span className="value">{formatCurrency(customer.revenue)}</span>
                </div>
                <div className="customer-card__stat">
                  <span className="label">Health</span>
                  <span className={`value ${getHealthColor(customer.healthScore)}`}>
                    {customer.healthScore}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="customers__pagination">
        <span className="pagination-info">
          Showing {filteredCustomers.length} of {customers.length} customers
        </span>
      </div>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingCustomer ? 'Edit Customer' : 'Add New Customer'}
        size="medium"
      >
        <CustomerForm
          customer={editingCustomer}
          onSubmit={editingCustomer ? handleUpdateCustomer : handleCreateCustomer}
          onCancel={handleCloseModal}
        />
      </Modal>
    </div>
  );
};

export default Customers;
