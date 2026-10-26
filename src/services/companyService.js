import api from './api';
import { initialCompanies } from '../data/mockDashboardData';

const COMPANIES_STORAGE_KEY = 'job_portal_companies';
const ACTIVITIES_STORAGE_KEY = 'job_portal_recent_activities';

// Curated industry options
export const INDUSTRY_OPTIONS = [
  'Technology',
  'Healthcare',
  'Finance & FinTech',
  'Cloud & DevOps',
  'Cybersecurity',
  'Design & Creative',
  'AI & Data Science',
  'E-Commerce',
  'Digital Media',
];

// Employee size options
export const EMPLOYEE_RANGES = [
  '10-50 employees',
  '50-100 employees',
  '100-250 employees',
  '250-500 employees',
  '500-1000 employees',
  '1000+ employees',
];

// Curated high quality avatars for companies
const defaultLogos = [
  'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1551434678-e076c223a692?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?w=150&auto=format&fit=crop&q=80',
];

// Map a JSONPlaceholder User into a complete Company Object
const mapApiUserToCompany = (user, index) => {
  const industries = [
    'Technology',
    'Finance & FinTech',
    'Cloud & DevOps',
    'AI & Data Science',
    'Healthcare',
    'Cybersecurity',
    'Design & Creative',
    'E-Commerce',
  ];
  const industry = industries[index % industries.length];
  const empRanges = ['100-250 employees', '250-500 employees', '500-1000 employees', '1000+ employees'];
  const employees = empRanges[index % empRanges.length];

  const logo = defaultLogos[index % defaultLogos.length];

  return {
    id: `comp-api-${user.id}`,
    apiId: user.id,
    name: user.company?.name || user.name,
    logo: logo,
    logoText: (user.company?.name || user.name).substring(0, 2).toUpperCase(),
    industry: industry,
    location: `${user.address?.city || 'San Francisco'}, USA`,
    website: `https://${(user.website || 'company.com').toLowerCase()}`,
    contactEmail: user.email.toLowerCase(),
    employees: employees,
    description: `${user.company?.catchPhrase || 'Driving enterprise innovation'}. Specialized in ${user.company?.bs || 'scalable cloud infrastructure and digital services'}. We empower global talent with world-class engineering workflows and flexible culture.`,
    foundedYear: 2015 + (index % 10),
    activeJobs: (index % 3) + 1,
  };
};

// Safe storage access
const getStoredCompanies = () => {
  try {
    const raw = localStorage.getItem(COMPANIES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.error('Error reading companies from storage:', e);
    return null;
  }
};

const setStoredCompanies = (companies) => {
  try {
    localStorage.setItem(COMPANIES_STORAGE_KEY, JSON.stringify(companies));
  } catch (e) {
    console.error('Error saving companies to storage:', e);
  }
};

const logActivity = (activity) => {
  try {
    const raw = localStorage.getItem(ACTIVITIES_STORAGE_KEY);
    const list = raw ? JSON.parse(raw) : [];
    const updated = [activity, ...list.slice(0, 9)];
    localStorage.setItem(ACTIVITIES_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Error logging company activity:', e);
  }
};

export const companyService = {
  // 1. Display Company List with Third-Party API Integration (Axios)
  getCompanies: async (forceRefresh = false) => {
    const localCompanies = getStoredCompanies();

    // If we have cached/modified data in localStorage and not forcing a refresh, return immediately
    if (localCompanies && localCompanies.length > 0 && !forceRefresh) {
      return localCompanies;
    }

    try {
      // Real network call to third-party API (JSONPlaceholder)
      const response = await api.get('/users');
      const apiUsers = response.data || [];

      // Transform API users to full Company Schema
      const apiCompanies = apiUsers.map((user, idx) => mapApiUserToCompany(user, idx));

      // Combine with our verified seed companies to preserve relations
      const mergedMap = new Map();
      initialCompanies.forEach((c) => {
        mergedMap.set(c.id, {
          ...c,
          logo: c.logo || defaultLogos[0],
          website: c.website || 'https://techcorp.example.com',
          contactEmail: `contact@${c.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
          employees: c.employees ? `${c.employees} employees` : '100-250 employees',
          description: c.description || `${c.name} is a high-growth leader in ${c.industry}. Building next-generation digital products and hiring top-tier talent.`,
          foundedYear: 2018,
        });
      });

      apiCompanies.forEach((ac) => {
        mergedMap.set(ac.id, ac);
      });

      const combined = Array.from(mergedMap.values());
      setStoredCompanies(combined);
      return combined;
    } catch (error) {
      console.warn('API fetch failed, falling back to local storage or seed data:', error);
      if (localCompanies && localCompanies.length > 0) {
        return localCompanies;
      }
      return initialCompanies;
    }
  },

  // 2. Company Details Page
  getCompanyById: async (id) => {
    const companies = await companyService.getCompanies();
    const company = companies.find((c) => String(c.id) === String(id));
    if (!company) {
      throw new Error(`Company with ID "${id}" was not found.`);
    }
    return company;
  },

  // 3. Add Company (Simulates POST to third-party API & syncs with Local Storage)
  addCompany: async (companyData) => {
    // Make actual POST request to third-party API via Axios
    let apiResponse = null;
    try {
      apiResponse = await api.post('/users', {
        name: companyData.name,
        email: companyData.contactEmail,
        website: companyData.website,
        company: {
          name: companyData.name,
          catchPhrase: companyData.description,
        },
      });
    } catch (e) {
      console.warn('Third-party API POST simulated locally:', e);
    }

    const currentCompanies = (await companyService.getCompanies()) || [];
    const newId = `comp-${Date.now()}`;

    const newCompany = {
      id: newId,
      apiId: apiResponse?.data?.id || Math.floor(Math.random() * 1000) + 100,
      name: companyData.name.trim(),
      logo: companyData.logo?.trim() || defaultLogos[Math.floor(Math.random() * defaultLogos.length)],
      logoText: companyData.name.trim().substring(0, 2).toUpperCase(),
      industry: companyData.industry || 'Technology',
      location: companyData.location?.trim() || 'Remote, US',
      website: companyData.website?.trim() || 'https://example.com',
      contactEmail: companyData.contactEmail?.trim().toLowerCase() || 'contact@example.com',
      employees: companyData.employees || '50-100 employees',
      description: companyData.description?.trim() || `${companyData.name} is a premier organization hiring top candidates.`,
      foundedYear: companyData.foundedYear || new Date().getFullYear(),
      activeJobs: 0,
      createdAt: new Date().toISOString(),
    };

    const updated = [newCompany, ...currentCompanies];
    setStoredCompanies(updated);

    // Log Activity for Module 2 Dashboard synchronization
    logActivity({
      id: `act-${Date.now()}`,
      type: 'company',
      title: 'New Company Registered',
      description: `${newCompany.name} (${newCompany.industry}) joined the VS Job Portal ecosystem.`,
      timestamp: 'Just now',
      badge: 'Company Added',
      badgeColor: 'amber',
      iconName: 'Building2',
    });

    return newCompany;
  },

  // 4. Edit Company (Simulates PUT to third-party API & syncs with Local Storage)
  updateCompany: async (id, companyData) => {
    // Attempt PUT call to Third-Party API
    try {
      if (typeof id === 'number' || !isNaN(id)) {
        await api.put(`/users/${id}`, companyData);
      }
    } catch (e) {
      console.warn('Third-party API PUT simulated locally:', e);
    }

    const currentCompanies = (await companyService.getCompanies()) || [];
    const index = currentCompanies.findIndex((c) => String(c.id) === String(id));

    if (index === -1) {
      throw new Error(`Company not found with ID: ${id}`);
    }

    const existing = currentCompanies[index];
    const updatedCompany = {
      ...existing,
      name: companyData.name?.trim() || existing.name,
      logo: companyData.logo?.trim() || existing.logo,
      logoText: (companyData.name || existing.name).trim().substring(0, 2).toUpperCase(),
      industry: companyData.industry || existing.industry,
      location: companyData.location?.trim() || existing.location,
      website: companyData.website?.trim() || existing.website,
      contactEmail: companyData.contactEmail?.trim().toLowerCase() || existing.contactEmail,
      employees: companyData.employees || existing.employees,
      description: companyData.description?.trim() || existing.description,
      updatedAt: new Date().toISOString(),
    };

    currentCompanies[index] = updatedCompany;
    setStoredCompanies(currentCompanies);

    logActivity({
      id: `act-${Date.now()}`,
      type: 'company',
      title: 'Company Profile Updated',
      description: `${updatedCompany.name} updated their official company details and location.`,
      timestamp: 'Just now',
      badge: 'Company Edit',
      badgeColor: 'indigo',
      iconName: 'Building2',
    });

    return updatedCompany;
  },

  // 5. Delete Company (Simulates DELETE to third-party API & syncs with Local Storage)
  deleteCompany: async (id) => {
    try {
      if (typeof id === 'number' || !isNaN(id)) {
        await api.delete(`/users/${id}`);
      }
    } catch (e) {
      console.warn('Third-party API DELETE simulated locally:', e);
    }

    const currentCompanies = (await companyService.getCompanies()) || [];
    const target = currentCompanies.find((c) => String(c.id) === String(id));
    const filtered = currentCompanies.filter((c) => String(c.id) !== String(id));

    setStoredCompanies(filtered);

    if (target) {
      logActivity({
        id: `act-${Date.now()}`,
        type: 'company',
        title: 'Company Removed',
        description: `${target.name} was removed from the verified employers directory.`,
        timestamp: 'Just now',
        badge: 'Deleted',
        badgeColor: 'rose',
        iconName: 'Building2',
      });
    }

    return { success: true, deletedId: id };
  },
};

export default companyService;
