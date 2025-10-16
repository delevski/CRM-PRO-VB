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

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.industry.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="customers-loading">
        <div className="loading-spinner" />
        <p>Loading customers...</p>
      </div>
    );
  }

  return (
    <div className="customers">
      <div className="customers__header">
        <h1>Customers</h1>
        <div className="customers__actions">
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="customers__search"
          />
          <Button
            variant="primary"
            onClick={() => setShowModal(true)}
          >
            Add Customer
          </Button>
        </div>
      </div>

      {error && (
        <div className="customers__error">
          <p>Error: {error}</p>
          <Button variant="secondary" onClick={fetchCustomers}>
            Retry
          </Button>
        </div>
      )}

      <div className="customers__grid">
        {filteredCustomers.map(customer => (
          <div key={customer.id} className="customer-card">
            <div className="customer-card__header">
              <h3 className="customer-card__name">{customer.name}</h3>
              <span className={`customer-card__status customer-card__status--${customer.status}`}>
                {customer.status}
              </span>
            </div>
            
            <div className="customer-card__content">
              <div className="customer-card__info">
                <p className="customer-card__email">
                  <span className="customer-card__label">Email:</span>
                  {customer.email}
                </p>
                <p className="customer-card__phone">
                  <span className="customer-card__label">Phone:</span>
                  {customer.phone}
                </p>
                <p className="customer-card__industry">
                  <span className="customer-card__label">Industry:</span>
                  {customer.industry}
                </p>
                {customer.address && (
                  <p className="customer-card__address">
                    <span className="customer-card__label">Address:</span>
                    {`${customer.address.city}, ${customer.address.state}`}
                  </p>
                )}
              </div>
            </div>
            
            <div className="customer-card__actions">
              <Button
                variant="secondary"
                size="small"
                onClick={() => handleEditCustomer(customer)}
              >
                Edit
              </Button>
              <Button
                variant="danger"
                size="small"
                onClick={() => handleDeleteCustomer(customer.id)}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      {filteredCustomers.length === 0 && !loading && (
        <div className="customers__empty">
          <p>No customers found.</p>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            Add Your First Customer
          </Button>
        </div>
      )}

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


