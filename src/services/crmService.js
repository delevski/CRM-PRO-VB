// Mock CRM Service - In a real app, this would connect to your backend API
import { v4 as uuidv4 } from 'uuid';

// Mock data storage
let customers = [
  {
    id: '1',
    name: 'Acme Corporation',
    email: 'contact@acme.com',
    phone: '+1-555-0123',
    industry: 'Technology',
    status: 'active',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
    address: {
      street: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94105',
      country: 'USA'
    }
  },
  {
    id: '2',
    name: 'Global Industries',
    email: 'info@global.com',
    phone: '+1-555-0456',
    industry: 'Manufacturing',
    status: 'active',
    createdAt: '2024-01-20',
    updatedAt: '2024-01-20',
    address: {
      street: '456 Oak Ave',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    }
  }
];

let contacts = [
  {
    id: '1',
    customerId: '1',
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@acme.com',
    phone: '+1-555-0124',
    title: 'CEO',
    department: 'Executive',
    status: 'active',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: '2',
    customerId: '1',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@acme.com',
    phone: '+1-555-0125',
    title: 'CTO',
    department: 'Technology',
    status: 'active',
    createdAt: '2024-01-16',
    updatedAt: '2024-01-16'
  },
  {
    id: '3',
    customerId: '2',
    firstName: 'Mike',
    lastName: 'Wilson',
    email: 'mike.wilson@global.com',
    phone: '+1-555-0457',
    title: 'Operations Manager',
    department: 'Operations',
    status: 'active',
    createdAt: '2024-01-20',
    updatedAt: '2024-01-20'
  }
];

let deals = [
  {
    id: '1',
    customerId: '1',
    contactId: '1',
    title: 'Enterprise Software License',
    value: 50000,
    stage: 'proposal',
    probability: 75,
    expectedCloseDate: '2024-03-15',
    status: 'active',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
    description: 'Annual enterprise software license renewal'
  },
  {
    id: '2',
    customerId: '2',
    contactId: '3',
    title: 'Manufacturing Equipment',
    value: 125000,
    stage: 'negotiation',
    probability: 60,
    expectedCloseDate: '2024-04-30',
    status: 'active',
    createdAt: '2024-01-20',
    updatedAt: '2024-01-20',
    description: 'New manufacturing equipment purchase'
  }
];

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const crmService = {
  // Customer operations
  async getCustomers() {
    await delay(500);
    return [...customers];
  },

  async getCustomer(id) {
    await delay(300);
    return customers.find(customer => customer.id === id);
  },

  async createCustomer(customerData) {
    await delay(500);
    const newCustomer = {
      id: uuidv4(),
      ...customerData,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    customers.push(newCustomer);
    return newCustomer;
  },

  async updateCustomer(id, customerData) {
    await delay(500);
    const index = customers.findIndex(customer => customer.id === id);
    if (index === -1) {
      throw new Error('Customer not found');
    }
    customers[index] = {
      ...customers[index],
      ...customerData,
      updatedAt: new Date().toISOString().split('T')[0]
    };
    return customers[index];
  },

  async deleteCustomer(id) {
    await delay(500);
    const index = customers.findIndex(customer => customer.id === id);
    if (index === -1) {
      throw new Error('Customer not found');
    }
    customers.splice(index, 1);
    return { success: true };
  },

  // Contact operations
  async getContacts(customerId = null) {
    await delay(500);
    let filteredContacts = [...contacts];
    if (customerId) {
      filteredContacts = contacts.filter(contact => contact.customerId === customerId);
    }
    return filteredContacts;
  },

  async getContact(id) {
    await delay(300);
    return contacts.find(contact => contact.id === id);
  },

  async createContact(contactData) {
    await delay(500);
    const newContact = {
      id: uuidv4(),
      ...contactData,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    contacts.push(newContact);
    return newContact;
  },

  async updateContact(id, contactData) {
    await delay(500);
    const index = contacts.findIndex(contact => contact.id === id);
    if (index === -1) {
      throw new Error('Contact not found');
    }
    contacts[index] = {
      ...contacts[index],
      ...contactData,
      updatedAt: new Date().toISOString().split('T')[0]
    };
    return contacts[index];
  },

  async deleteContact(id) {
    await delay(500);
    const index = contacts.findIndex(contact => contact.id === id);
    if (index === -1) {
      throw new Error('Contact not found');
    }
    contacts.splice(index, 1);
    return { success: true };
  },

  // Deal operations
  async getDeals(customerId = null) {
    await delay(500);
    let filteredDeals = [...deals];
    if (customerId) {
      filteredDeals = deals.filter(deal => deal.customerId === customerId);
    }
    return filteredDeals;
  },

  async getDeal(id) {
    await delay(300);
    return deals.find(deal => deal.id === id);
  },

  async createDeal(dealData) {
    await delay(500);
    const newDeal = {
      id: uuidv4(),
      ...dealData,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    deals.push(newDeal);
    return newDeal;
  },

  async updateDeal(id, dealData) {
    await delay(500);
    const index = deals.findIndex(deal => deal.id === id);
    if (index === -1) {
      throw new Error('Deal not found');
    }
    deals[index] = {
      ...deals[index],
      ...dealData,
      updatedAt: new Date().toISOString().split('T')[0]
    };
    return deals[index];
  },

  async deleteDeal(id) {
    await delay(500);
    const index = deals.findIndex(deal => deal.id === id);
    if (index === -1) {
      throw new Error('Deal not found');
    }
    deals.splice(index, 1);
    return { success: true };
  },

  // Analytics
  async getDashboardStats() {
    await delay(500);
    const totalCustomers = customers.length;
    const totalContacts = contacts.length;
    const totalDeals = deals.length;
    const totalDealValue = deals.reduce((sum, deal) => sum + deal.value, 0);
    const activeDeals = deals.filter(deal => deal.status === 'active').length;
    const wonDeals = deals.filter(deal => deal.stage === 'closed-won').length;

    return {
      totalCustomers,
      totalContacts,
      totalDeals,
      totalDealValue,
      activeDeals,
      wonDeals,
      conversionRate: totalDeals > 0 ? (wonDeals / totalDeals) * 100 : 0
    };
  }
};


