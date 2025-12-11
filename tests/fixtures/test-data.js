/**
 * Test data fixtures for CRM application
 */

export const testCustomers = [
  {
    name: 'Test Company Inc',
    email: 'test@testcompany.com',
    phone: '+1-555-0123',
    industry: 'Technology',
    address: {
      street: '123 Test Street',
      city: 'Test City',
      state: 'CA',
      zipCode: '90210',
      country: 'USA'
    }
  },
  {
    name: 'Sample Corp',
    email: 'contact@samplecorp.com',
    phone: '+1-555-0456',
    industry: 'Manufacturing',
    address: {
      street: '456 Sample Ave',
      city: 'Sample City',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    }
  }
];

export const testContacts = [
  {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@testcompany.com',
    phone: '+1-555-0124',
    title: 'CEO',
    department: 'Executive'
  },
  {
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@samplecorp.com',
    phone: '+1-555-0457',
    title: 'CTO',
    department: 'Technology'
  }
];

export const testDeals = [
  {
    title: 'Enterprise Software License',
    value: 50000,
    stage: 'proposal',
    probability: 75,
    expectedCloseDate: '2024-03-15',
    description: 'Annual enterprise software license renewal'
  },
  {
    title: 'Manufacturing Equipment',
    value: 125000,
    stage: 'negotiation',
    probability: 60,
    expectedCloseDate: '2024-04-30',
    description: 'New manufacturing equipment purchase'
  }
];

export const invalidCustomerData = {
  name: '', // Invalid: empty name
  email: 'invalid-email', // Invalid: malformed email
  phone: '', // Invalid: empty phone
  industry: '', // Invalid: empty industry
  address: {
    city: '', // Invalid: empty city
    state: '', // Invalid: empty state
  }
};





