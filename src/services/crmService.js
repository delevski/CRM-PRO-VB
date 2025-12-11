// Professional CRM Service with Rich Mock Data
import { v4 as uuidv4 } from 'uuid';

// Comprehensive mock data for CEO MVP Demo
let customers = [
  {
    id: '1',
    name: 'Stripe Inc.',
    email: 'enterprise@stripe.com',
    phone: '+1-415-555-0100',
    industry: 'Financial Technology',
    status: 'active',
    revenue: 14000000000,
    employees: 8000,
    website: 'stripe.com',
    logo: 'https://logo.clearbit.com/stripe.com',
    createdAt: '2024-01-15',
    updatedAt: '2024-03-10',
    tier: 'enterprise',
    healthScore: 95,
    lastContact: '2024-03-08',
    address: {
      street: '354 Oyster Point Blvd',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94080',
      country: 'USA'
    }
  },
  {
    id: '2',
    name: 'Notion Labs',
    email: 'partnerships@notion.so',
    phone: '+1-415-555-0200',
    industry: 'Productivity Software',
    status: 'active',
    revenue: 500000000,
    employees: 1500,
    website: 'notion.so',
    logo: 'https://logo.clearbit.com/notion.so',
    createdAt: '2024-01-20',
    updatedAt: '2024-03-12',
    tier: 'enterprise',
    healthScore: 88,
    lastContact: '2024-03-11',
    address: {
      street: '2300 Harrison St',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94110',
      country: 'USA'
    }
  },
  {
    id: '3',
    name: 'Vercel Inc.',
    email: 'sales@vercel.com',
    phone: '+1-628-555-0300',
    industry: 'Cloud Infrastructure',
    status: 'active',
    revenue: 250000000,
    employees: 450,
    website: 'vercel.com',
    logo: 'https://logo.clearbit.com/vercel.com',
    createdAt: '2024-02-01',
    updatedAt: '2024-03-15',
    tier: 'growth',
    healthScore: 92,
    lastContact: '2024-03-14',
    address: {
      street: '340 S Lemon Ave',
      city: 'Walnut',
      state: 'CA',
      zipCode: '91789',
      country: 'USA'
    }
  },
  {
    id: '4',
    name: 'Linear Software',
    email: 'team@linear.app',
    phone: '+1-415-555-0400',
    industry: 'Project Management',
    status: 'active',
    revenue: 80000000,
    employees: 120,
    website: 'linear.app',
    logo: 'https://logo.clearbit.com/linear.app',
    createdAt: '2024-02-10',
    updatedAt: '2024-03-16',
    tier: 'growth',
    healthScore: 96,
    lastContact: '2024-03-15',
    address: {
      street: '548 Market St',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94104',
      country: 'USA'
    }
  },
  {
    id: '5',
    name: 'Figma Inc.',
    email: 'enterprise@figma.com',
    phone: '+1-415-555-0500',
    industry: 'Design Software',
    status: 'active',
    revenue: 600000000,
    employees: 1200,
    website: 'figma.com',
    logo: 'https://logo.clearbit.com/figma.com',
    createdAt: '2024-01-25',
    updatedAt: '2024-03-14',
    tier: 'enterprise',
    healthScore: 91,
    lastContact: '2024-03-12',
    address: {
      street: '760 Market St',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102',
      country: 'USA'
    }
  },
  {
    id: '6',
    name: 'Datadog Inc.',
    email: 'partnerships@datadog.com',
    phone: '+1-866-329-4466',
    industry: 'Cloud Monitoring',
    status: 'active',
    revenue: 2100000000,
    employees: 5000,
    website: 'datadog.com',
    logo: 'https://logo.clearbit.com/datadog.com',
    createdAt: '2024-01-18',
    updatedAt: '2024-03-13',
    tier: 'enterprise',
    healthScore: 87,
    lastContact: '2024-03-10',
    address: {
      street: '620 8th Ave',
      city: 'New York',
      state: 'NY',
      zipCode: '10018',
      country: 'USA'
    }
  },
  {
    id: '7',
    name: 'Retool Inc.',
    email: 'sales@retool.com',
    phone: '+1-415-555-0700',
    industry: 'Low-Code Platform',
    status: 'active',
    revenue: 120000000,
    employees: 350,
    website: 'retool.com',
    logo: 'https://logo.clearbit.com/retool.com',
    createdAt: '2024-02-05',
    updatedAt: '2024-03-11',
    tier: 'growth',
    healthScore: 94,
    lastContact: '2024-03-09',
    address: {
      street: '548 Market St',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94104',
      country: 'USA'
    }
  },
  {
    id: '8',
    name: 'Loom Inc.',
    email: 'enterprise@loom.com',
    phone: '+1-415-555-0800',
    industry: 'Video Communication',
    status: 'active',
    revenue: 200000000,
    employees: 400,
    website: 'loom.com',
    logo: 'https://logo.clearbit.com/loom.com',
    createdAt: '2024-02-15',
    updatedAt: '2024-03-14',
    tier: 'growth',
    healthScore: 89,
    lastContact: '2024-03-13',
    address: {
      street: '140 New Montgomery St',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94105',
      country: 'USA'
    }
  },
  {
    id: '9',
    name: 'Airtable Inc.',
    email: 'team@airtable.com',
    phone: '+1-415-555-0900',
    industry: 'Database Software',
    status: 'inactive',
    revenue: 350000000,
    employees: 900,
    website: 'airtable.com',
    logo: 'https://logo.clearbit.com/airtable.com',
    createdAt: '2024-01-22',
    updatedAt: '2024-03-08',
    tier: 'enterprise',
    healthScore: 72,
    lastContact: '2024-02-28',
    address: {
      street: '799 Market St',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94103',
      country: 'USA'
    }
  },
  {
    id: '10',
    name: 'Webflow Inc.',
    email: 'sales@webflow.com',
    phone: '+1-415-555-1000',
    industry: 'Web Development',
    status: 'active',
    revenue: 150000000,
    employees: 600,
    website: 'webflow.com',
    logo: 'https://logo.clearbit.com/webflow.com',
    createdAt: '2024-02-08',
    updatedAt: '2024-03-15',
    tier: 'growth',
    healthScore: 93,
    lastContact: '2024-03-14',
    address: {
      street: '398 11th St',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94103',
      country: 'USA'
    }
  },
  {
    id: '11',
    name: 'Supabase Inc.',
    email: 'enterprise@supabase.io',
    phone: '+1-415-555-1100',
    industry: 'Backend Infrastructure',
    status: 'active',
    revenue: 80000000,
    employees: 200,
    website: 'supabase.com',
    logo: 'https://logo.clearbit.com/supabase.com',
    createdAt: '2024-02-20',
    updatedAt: '2024-03-16',
    tier: 'growth',
    healthScore: 97,
    lastContact: '2024-03-15',
    address: {
      street: '123 Mission St',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94105',
      country: 'USA'
    }
  },
  {
    id: '12',
    name: 'Railway App',
    email: 'team@railway.app',
    phone: '+1-415-555-1200',
    industry: 'Cloud Deployment',
    status: 'active',
    revenue: 25000000,
    employees: 50,
    website: 'railway.app',
    logo: 'https://logo.clearbit.com/railway.app',
    createdAt: '2024-02-25',
    updatedAt: '2024-03-16',
    tier: 'startup',
    healthScore: 91,
    lastContact: '2024-03-15',
    address: {
      street: '456 Tech Blvd',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94107',
      country: 'USA'
    }
  }
];

let contacts = [
  {
    id: '1',
    customerId: '1',
    firstName: 'Patrick',
    lastName: 'Collison',
    email: 'patrick@stripe.com',
    phone: '+1-415-555-0101',
    title: 'CEO & Co-founder',
    department: 'Executive',
    status: 'active',
    avatar: 'https://ui-avatars.com/api/?name=Patrick+Collison&background=635bff&color=fff',
    linkedin: 'linkedin.com/in/patrickcollison',
    lastContact: '2024-03-08',
    createdAt: '2024-01-15',
    updatedAt: '2024-03-08'
  },
  {
    id: '2',
    customerId: '1',
    firstName: 'Claire',
    lastName: 'Hughes',
    email: 'claire@stripe.com',
    phone: '+1-415-555-0102',
    title: 'COO',
    department: 'Operations',
    status: 'active',
    avatar: 'https://ui-avatars.com/api/?name=Claire+Hughes&background=635bff&color=fff',
    linkedin: 'linkedin.com/in/clairehughes',
    lastContact: '2024-03-10',
    createdAt: '2024-01-16',
    updatedAt: '2024-03-10'
  },
  {
    id: '3',
    customerId: '2',
    firstName: 'Ivan',
    lastName: 'Zhao',
    email: 'ivan@notion.so',
    phone: '+1-415-555-0201',
    title: 'CEO & Co-founder',
    department: 'Executive',
    status: 'active',
    avatar: 'https://ui-avatars.com/api/?name=Ivan+Zhao&background=000000&color=fff',
    linkedin: 'linkedin.com/in/ivanzhao',
    lastContact: '2024-03-11',
    createdAt: '2024-01-20',
    updatedAt: '2024-03-11'
  },
  {
    id: '4',
    customerId: '3',
    firstName: 'Guillermo',
    lastName: 'Rauch',
    email: 'guillermo@vercel.com',
    phone: '+1-628-555-0301',
    title: 'CEO & Founder',
    department: 'Executive',
    status: 'active',
    avatar: 'https://ui-avatars.com/api/?name=Guillermo+Rauch&background=000000&color=fff',
    linkedin: 'linkedin.com/in/guillermo-rauch',
    lastContact: '2024-03-14',
    createdAt: '2024-02-01',
    updatedAt: '2024-03-14'
  },
  {
    id: '5',
    customerId: '4',
    firstName: 'Karri',
    lastName: 'Saarinen',
    email: 'karri@linear.app',
    phone: '+1-415-555-0401',
    title: 'CEO & Co-founder',
    department: 'Executive',
    status: 'active',
    avatar: 'https://ui-avatars.com/api/?name=Karri+Saarinen&background=5e6ad2&color=fff',
    linkedin: 'linkedin.com/in/karri-saarinen',
    lastContact: '2024-03-15',
    createdAt: '2024-02-10',
    updatedAt: '2024-03-15'
  },
  {
    id: '6',
    customerId: '5',
    firstName: 'Dylan',
    lastName: 'Field',
    email: 'dylan@figma.com',
    phone: '+1-415-555-0501',
    title: 'CEO & Co-founder',
    department: 'Executive',
    status: 'active',
    avatar: 'https://ui-avatars.com/api/?name=Dylan+Field&background=a259ff&color=fff',
    linkedin: 'linkedin.com/in/dylanfield',
    lastContact: '2024-03-12',
    createdAt: '2024-01-25',
    updatedAt: '2024-03-12'
  },
  {
    id: '7',
    customerId: '5',
    firstName: 'Amanda',
    lastName: 'Kleha',
    email: 'amanda@figma.com',
    phone: '+1-415-555-0502',
    title: 'Chief Business Officer',
    department: 'Sales',
    status: 'active',
    avatar: 'https://ui-avatars.com/api/?name=Amanda+Kleha&background=a259ff&color=fff',
    linkedin: 'linkedin.com/in/amandakleha',
    lastContact: '2024-03-13',
    createdAt: '2024-01-26',
    updatedAt: '2024-03-13'
  },
  {
    id: '8',
    customerId: '6',
    firstName: 'Olivier',
    lastName: 'Pomel',
    email: 'olivier@datadog.com',
    phone: '+1-866-329-4467',
    title: 'CEO & Co-founder',
    department: 'Executive',
    status: 'active',
    avatar: 'https://ui-avatars.com/api/?name=Olivier+Pomel&background=632ca6&color=fff',
    linkedin: 'linkedin.com/in/olivier-pomel',
    lastContact: '2024-03-10',
    createdAt: '2024-01-18',
    updatedAt: '2024-03-10'
  },
  {
    id: '9',
    customerId: '7',
    firstName: 'David',
    lastName: 'Hsu',
    email: 'david@retool.com',
    phone: '+1-415-555-0701',
    title: 'CEO & Co-founder',
    department: 'Executive',
    status: 'active',
    avatar: 'https://ui-avatars.com/api/?name=David+Hsu&background=3d3d3d&color=fff',
    linkedin: 'linkedin.com/in/davidhsu',
    lastContact: '2024-03-09',
    createdAt: '2024-02-05',
    updatedAt: '2024-03-09'
  },
  {
    id: '10',
    customerId: '8',
    firstName: 'Joe',
    lastName: 'Thomas',
    email: 'joe@loom.com',
    phone: '+1-415-555-0801',
    title: 'CEO & Co-founder',
    department: 'Executive',
    status: 'active',
    avatar: 'https://ui-avatars.com/api/?name=Joe+Thomas&background=625df5&color=fff',
    linkedin: 'linkedin.com/in/joethomas',
    lastContact: '2024-03-13',
    createdAt: '2024-02-15',
    updatedAt: '2024-03-13'
  },
  {
    id: '11',
    customerId: '10',
    firstName: 'Vlad',
    lastName: 'Magdalin',
    email: 'vlad@webflow.com',
    phone: '+1-415-555-1001',
    title: 'CEO & Co-founder',
    department: 'Executive',
    status: 'active',
    avatar: 'https://ui-avatars.com/api/?name=Vlad+Magdalin&background=4353ff&color=fff',
    linkedin: 'linkedin.com/in/vladmagdalin',
    lastContact: '2024-03-14',
    createdAt: '2024-02-08',
    updatedAt: '2024-03-14'
  },
  {
    id: '12',
    customerId: '11',
    firstName: 'Paul',
    lastName: 'Copplestone',
    email: 'paul@supabase.io',
    phone: '+1-415-555-1101',
    title: 'CEO & Co-founder',
    department: 'Executive',
    status: 'active',
    avatar: 'https://ui-avatars.com/api/?name=Paul+Copplestone&background=3ecf8e&color=fff',
    linkedin: 'linkedin.com/in/paulcopplestone',
    lastContact: '2024-03-15',
    createdAt: '2024-02-20',
    updatedAt: '2024-03-15'
  }
];

let deals = [
  {
    id: '1',
    customerId: '1',
    contactId: '1',
    title: 'Enterprise Platform License',
    value: 2500000,
    stage: 'closed-won',
    probability: 100,
    expectedCloseDate: '2024-02-28',
    actualCloseDate: '2024-02-25',
    status: 'won',
    createdAt: '2024-01-15',
    updatedAt: '2024-02-25',
    description: 'Annual enterprise platform license with premium support'
  },
  {
    id: '2',
    customerId: '2',
    contactId: '3',
    title: 'Team Workspace Solution',
    value: 750000,
    stage: 'negotiation',
    probability: 75,
    expectedCloseDate: '2024-04-15',
    status: 'active',
    createdAt: '2024-01-20',
    updatedAt: '2024-03-12',
    description: 'Enterprise team workspace with custom integrations'
  },
  {
    id: '3',
    customerId: '3',
    contactId: '4',
    title: 'Cloud Deployment Package',
    value: 450000,
    stage: 'proposal',
    probability: 60,
    expectedCloseDate: '2024-05-01',
    status: 'active',
    createdAt: '2024-02-01',
    updatedAt: '2024-03-15',
    description: 'Enterprise cloud deployment and CI/CD integration'
  },
  {
    id: '4',
    customerId: '4',
    contactId: '5',
    title: 'Project Management Suite',
    value: 180000,
    stage: 'closed-won',
    probability: 100,
    expectedCloseDate: '2024-03-10',
    actualCloseDate: '2024-03-08',
    status: 'won',
    createdAt: '2024-02-10',
    updatedAt: '2024-03-08',
    description: 'Company-wide project management implementation'
  },
  {
    id: '5',
    customerId: '5',
    contactId: '6',
    title: 'Design System Enterprise',
    value: 1200000,
    stage: 'qualification',
    probability: 40,
    expectedCloseDate: '2024-06-30',
    status: 'active',
    createdAt: '2024-01-25',
    updatedAt: '2024-03-14',
    description: 'Enterprise design system with unlimited seats'
  },
  {
    id: '6',
    customerId: '6',
    contactId: '8',
    title: 'Infrastructure Monitoring',
    value: 3200000,
    stage: 'proposal',
    probability: 65,
    expectedCloseDate: '2024-04-30',
    status: 'active',
    createdAt: '2024-01-18',
    updatedAt: '2024-03-13',
    description: 'Full-stack monitoring and APM solution'
  },
  {
    id: '7',
    customerId: '7',
    contactId: '9',
    title: 'Internal Tools Platform',
    value: 320000,
    stage: 'closed-won',
    probability: 100,
    expectedCloseDate: '2024-03-01',
    actualCloseDate: '2024-02-28',
    status: 'won',
    createdAt: '2024-02-05',
    updatedAt: '2024-02-28',
    description: 'Low-code internal tools development platform'
  },
  {
    id: '8',
    customerId: '8',
    contactId: '10',
    title: 'Video Communication Suite',
    value: 280000,
    stage: 'negotiation',
    probability: 80,
    expectedCloseDate: '2024-04-01',
    status: 'active',
    createdAt: '2024-02-15',
    updatedAt: '2024-03-14',
    description: 'Async video messaging for remote teams'
  },
  {
    id: '9',
    customerId: '10',
    contactId: '11',
    title: 'Web Development Platform',
    value: 420000,
    stage: 'proposal',
    probability: 55,
    expectedCloseDate: '2024-05-15',
    status: 'active',
    createdAt: '2024-02-08',
    updatedAt: '2024-03-15',
    description: 'No-code website builder enterprise license'
  },
  {
    id: '10',
    customerId: '11',
    contactId: '12',
    title: 'Backend-as-a-Service',
    value: 185000,
    stage: 'closed-won',
    probability: 100,
    expectedCloseDate: '2024-03-15',
    actualCloseDate: '2024-03-12',
    status: 'won',
    createdAt: '2024-02-20',
    updatedAt: '2024-03-12',
    description: 'Managed Postgres and real-time subscriptions'
  },
  {
    id: '11',
    customerId: '1',
    contactId: '2',
    title: 'Payment Processing Expansion',
    value: 1800000,
    stage: 'qualification',
    probability: 35,
    expectedCloseDate: '2024-07-01',
    status: 'active',
    createdAt: '2024-03-01',
    updatedAt: '2024-03-16',
    description: 'International payment processing expansion'
  },
  {
    id: '12',
    customerId: '5',
    contactId: '7',
    title: 'FigJam Enterprise Addon',
    value: 350000,
    stage: 'negotiation',
    probability: 70,
    expectedCloseDate: '2024-04-20',
    status: 'active',
    createdAt: '2024-02-28',
    updatedAt: '2024-03-15',
    description: 'Collaborative whiteboarding enterprise addon'
  },
  {
    id: '13',
    customerId: '9',
    contactId: null,
    title: 'Database Platform Renewal',
    value: 580000,
    stage: 'closed-lost',
    probability: 0,
    expectedCloseDate: '2024-03-01',
    actualCloseDate: '2024-02-28',
    status: 'lost',
    createdAt: '2024-01-22',
    updatedAt: '2024-02-28',
    description: 'Annual platform renewal - lost to competitor'
  }
];

// Activity log for recent activities
let activities = [
  {
    id: '1',
    type: 'deal_won',
    title: 'Deal Closed',
    description: 'Backend-as-a-Service deal with Supabase Inc.',
    value: 185000,
    timestamp: '2024-03-12T14:30:00Z',
    userId: 'user1',
    relatedId: '10'
  },
  {
    id: '2',
    type: 'meeting',
    title: 'Product Demo',
    description: 'Enterprise demo with Stripe team',
    timestamp: '2024-03-11T10:00:00Z',
    userId: 'user1',
    relatedId: '1'
  },
  {
    id: '3',
    type: 'deal_won',
    title: 'Deal Closed',
    description: 'Project Management Suite with Linear Software',
    value: 180000,
    timestamp: '2024-03-08T16:45:00Z',
    userId: 'user2',
    relatedId: '4'
  },
  {
    id: '4',
    type: 'email',
    title: 'Follow-up Sent',
    description: 'Sent proposal follow-up to Datadog Inc.',
    timestamp: '2024-03-10T09:15:00Z',
    userId: 'user1',
    relatedId: '6'
  },
  {
    id: '5',
    type: 'call',
    title: 'Discovery Call',
    description: 'Initial call with Webflow enterprise team',
    timestamp: '2024-03-14T15:00:00Z',
    userId: 'user2',
    relatedId: '10'
  },
  {
    id: '6',
    type: 'deal_created',
    title: 'New Opportunity',
    description: 'Payment Processing Expansion with Stripe',
    value: 1800000,
    timestamp: '2024-03-01T11:30:00Z',
    userId: 'user1',
    relatedId: '11'
  },
  {
    id: '7',
    type: 'contact_added',
    title: 'New Contact',
    description: 'Added Amanda Kleha from Figma',
    timestamp: '2024-01-26T10:00:00Z',
    userId: 'user2',
    relatedId: '7'
  },
  {
    id: '8',
    type: 'deal_won',
    title: 'Deal Closed',
    description: 'Internal Tools Platform with Retool Inc.',
    value: 320000,
    timestamp: '2024-02-28T17:00:00Z',
    userId: 'user1',
    relatedId: '7'
  }
];

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const crmService = {
  // Customer operations
  async getCustomers() {
    await delay(300);
    return [...customers];
  },

  async getCustomer(id) {
    await delay(200);
    return customers.find(customer => customer.id === id);
  },

  async createCustomer(customerData) {
    await delay(400);
    const newCustomer = {
      id: uuidv4(),
      ...customerData,
      status: 'active',
      healthScore: 80,
      tier: 'startup',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    customers.push(newCustomer);
    return newCustomer;
  },

  async updateCustomer(id, customerData) {
    await delay(400);
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
    await delay(400);
    const index = customers.findIndex(customer => customer.id === id);
    if (index === -1) {
      throw new Error('Customer not found');
    }
    customers.splice(index, 1);
    return { success: true };
  },

  // Contact operations
  async getContacts(customerId = null) {
    await delay(300);
    let filteredContacts = [...contacts];
    if (customerId) {
      filteredContacts = contacts.filter(contact => contact.customerId === customerId);
    }
    return filteredContacts;
  },

  async getContact(id) {
    await delay(200);
    return contacts.find(contact => contact.id === id);
  },

  async createContact(contactData) {
    await delay(400);
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
    await delay(400);
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
    await delay(400);
    const index = contacts.findIndex(contact => contact.id === id);
    if (index === -1) {
      throw new Error('Contact not found');
    }
    contacts.splice(index, 1);
    return { success: true };
  },

  // Deal operations
  async getDeals(customerId = null) {
    await delay(300);
    let filteredDeals = [...deals];
    if (customerId) {
      filteredDeals = deals.filter(deal => deal.customerId === customerId);
    }
    return filteredDeals;
  },

  async getDeal(id) {
    await delay(200);
    return deals.find(deal => deal.id === id);
  },

  async createDeal(dealData) {
    await delay(400);
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
    await delay(400);
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
    await delay(400);
    const index = deals.findIndex(deal => deal.id === id);
    if (index === -1) {
      throw new Error('Deal not found');
    }
    deals.splice(index, 1);
    return { success: true };
  },

  // Activity operations
  async getActivities(limit = 10) {
    await delay(200);
    return [...activities]
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit);
  },

  // Analytics
  async getDashboardStats() {
    await delay(300);
    const totalCustomers = customers.length;
    const activeCustomers = customers.filter(c => c.status === 'active').length;
    const totalContacts = contacts.length;
    const totalDeals = deals.length;
    const activeDeals = deals.filter(deal => deal.status === 'active').length;
    const wonDeals = deals.filter(deal => deal.status === 'won').length;
    const lostDeals = deals.filter(deal => deal.status === 'lost').length;
    
    const totalDealValue = deals
      .filter(deal => deal.status === 'active')
      .reduce((sum, deal) => sum + deal.value, 0);
    
    const wonDealValue = deals
      .filter(deal => deal.status === 'won')
      .reduce((sum, deal) => sum + deal.value, 0);

    const totalRevenue = customers.reduce((sum, c) => sum + (c.revenue || 0), 0);
    
    const avgHealthScore = customers.reduce((sum, c) => sum + (c.healthScore || 0), 0) / totalCustomers;

    // Pipeline by stage
    const pipeline = {
      qualification: deals.filter(d => d.stage === 'qualification' && d.status === 'active'),
      proposal: deals.filter(d => d.stage === 'proposal' && d.status === 'active'),
      negotiation: deals.filter(d => d.stage === 'negotiation' && d.status === 'active'),
    };

    // Monthly revenue trend (mock data)
    const monthlyRevenue = [
      { month: 'Oct', value: 1850000 },
      { month: 'Nov', value: 2100000 },
      { month: 'Dec', value: 2450000 },
      { month: 'Jan', value: 2680000 },
      { month: 'Feb', value: 3185000 },
      { month: 'Mar', value: 3520000 }
    ];

    // Top customers by deal value
    const topCustomers = customers
      .map(customer => {
        const customerDeals = deals.filter(d => d.customerId === customer.id && d.status === 'won');
        const dealValue = customerDeals.reduce((sum, d) => sum + d.value, 0);
        return { ...customer, dealValue };
      })
      .filter(c => c.dealValue > 0)
      .sort((a, b) => b.dealValue - a.dealValue)
      .slice(0, 5);

    return {
      totalCustomers,
      activeCustomers,
      totalContacts,
      totalDeals,
      totalDealValue,
      activeDeals,
      wonDeals,
      lostDeals,
      wonDealValue,
      totalRevenue,
      avgHealthScore: Math.round(avgHealthScore),
      conversionRate: totalDeals > 0 ? ((wonDeals / (wonDeals + lostDeals)) * 100) : 0,
      pipeline,
      monthlyRevenue,
      topCustomers,
      recentActivities: activities.slice(0, 5)
    };
  }
};
