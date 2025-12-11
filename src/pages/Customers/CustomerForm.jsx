import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from '../../components/common/Button';
import Input from '../../components/forms/Input';
import './CustomerForm.css';

const CustomerForm = ({ customer, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    industry: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'USA'
    }
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name || '',
        email: customer.email || '',
        phone: customer.phone || '',
        industry: customer.industry || '',
        address: {
          street: customer.address?.street || '',
          city: customer.address?.city || '',
          state: customer.address?.state || '',
          zipCode: customer.address?.zipCode || '',
          country: customer.address?.country || 'USA'
        }
      });
    }
  }, [customer]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Company name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.industry.trim()) {
      newErrors.industry = 'Industry is required';
    }

    if (!formData.address.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.address.state.trim()) {
      newErrors.state = 'State is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="customer-form">
      <div className="customer-form__section">
        <h3>Company Information</h3>
        
        <Input
          label="Company Name"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          error={errors.name}
          required
          placeholder="Enter company name"
        />

        <Input
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          error={errors.email}
          required
          placeholder="Enter email address"
        />

        <Input
          label="Phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => handleInputChange('phone', e.target.value)}
          error={errors.phone}
          required
          placeholder="Enter phone number"
        />

        <Input
          label="Industry"
          value={formData.industry}
          onChange={(e) => handleInputChange('industry', e.target.value)}
          error={errors.industry}
          required
          placeholder="Enter industry"
        />
      </div>

      <div className="customer-form__section">
        <h3>Address Information</h3>
        
        <Input
          label="Street Address"
          value={formData.address.street}
          onChange={(e) => handleInputChange('address.street', e.target.value)}
          placeholder="Enter street address"
        />

        <div className="customer-form__row">
          <Input
            label="City"
            value={formData.address.city}
            onChange={(e) => handleInputChange('address.city', e.target.value)}
            error={errors.city}
            required
            placeholder="Enter city"
          />

          <Input
            label="State"
            value={formData.address.state}
            onChange={(e) => handleInputChange('address.state', e.target.value)}
            error={errors.state}
            required
            placeholder="Enter state"
          />
        </div>

        <div className="customer-form__row">
          <Input
            label="ZIP Code"
            value={formData.address.zipCode}
            onChange={(e) => handleInputChange('address.zipCode', e.target.value)}
            placeholder="Enter ZIP code"
          />

          <Input
            label="Country"
            value={formData.address.country}
            onChange={(e) => handleInputChange('address.country', e.target.value)}
            placeholder="Enter country"
          />
        </div>
      </div>

      <div className="customer-form__actions">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          loading={loading}
        >
          {customer ? 'Update Customer' : 'Create Customer'}
        </Button>
      </div>
    </form>
  );
};

CustomerForm.propTypes = {
  customer: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default CustomerForm;





