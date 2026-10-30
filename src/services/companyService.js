import api from './api';

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
export const mapApiUserToCompany = (user, index) => {
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

// Strict deduplication by ID and Name to ensure 0 duplicate companies
export const deduplicateCompanies = (companiesList) => {
  if (!Array.isArray(companiesList)) return [];
  const seenIds = new Set();
  const seenNames = new Set();

  return companiesList.filter((comp) => {
    if (!comp) return false;
    const idKey = String(comp.id || '').trim();
    const nameKey = (comp.name || '').trim().toLowerCase();

    if (idKey && seenIds.has(idKey)) return false;
    if (nameKey && seenNames.has(nameKey)) return false;

    if (idKey) seenIds.add(idKey);
    if (nameKey) seenNames.add(nameKey);
    return true;
  });
};

// Legacy mock company names from old prototype stages
const LEGACY_MOCK_NAMES = new Set([
  'techcorp solutions',
  'cloudsphere global',
  'digital horizon labs',
  'nextgen ai research',
  'apex healthtech',
  'cybershield systems',
  'omnidesign studio',
  'vanguard media group',
]);

// Identify legacy mock companies that should not pollute the pure API directory
export const isLegacyMockCompany = (comp) => {
  if (!comp) return true;
  const idStr = String(comp.id || '').trim();
  // Filter out legacy mock IDs like comp-1 to comp-20
  if (/^comp-[0-9]{1,2}$/.test(idStr)) return true;
  const nameLower = (comp.name || '').trim().toLowerCase();
  // Legacy mock names without valid API or timestamped user-created ID
  if (LEGACY_MOCK_NAMES.has(nameLower) && !idStr.startsWith('comp-api-') && !idStr.startsWith('comp-17')) {
    return true;
  }
  return false;
};

// Normalize every company object so all cards have complete, uniform, robust properties
export const normalizeCompany = (c, index = 0) => {
  const name = (c.name || 'Verified Organization').trim();
  const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '') || 'company';
  const logo =
    c.logo && typeof c.logo === 'string' && c.logo.startsWith('http')
      ? c.logo
      : defaultLogos[index % defaultLogos.length];
  const logoText = (c.logoText || name.substring(0, 2)).toUpperCase();
  const employees = c.employees
    ? String(c.employees).toLowerCase().includes('employee')
      ? c.employees
      : `${c.employees} employees`
    : '100-250 employees';
  const description =
    (c.description || '').trim() ||
    `${name} is a premier verified organization delivering scalable digital systems and hiring verified engineering talent.`;
  const website = (c.website || '').trim()
    ? c.website.startsWith('http')
      ? c.website
      : `https://${c.website.toLowerCase()}`
    : `https://${slug}.com`;
  const contactEmail = (c.contactEmail || '').trim()
    ? c.contactEmail.toLowerCase()
    : `contact@${slug}.com`;
  const location = (c.location || '').trim() || 'San Francisco, USA';
  const industry = c.industry || 'Technology';
  const activeJobs = typeof c.activeJobs === 'number' ? c.activeJobs : (index % 3) + 1;

  return {
    ...c,
    name,
    logo,
    logoText,
    employees,
    description,
    website,
    contactEmail,
    location,
    industry,
    activeJobs,
  };
};

// Safe storage access with auto-deduplication & legacy mock purging
export const getStoredCompanies = () => {
  try {
    const raw = localStorage.getItem(COMPANIES_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];

    const clean = deduplicateCompanies(
      parsed
        .filter((c) => !isLegacyMockCompany(c))
        .map((c, idx) => normalizeCompany(c, idx))
    );

    if (clean.length !== parsed.length) {
      localStorage.setItem(COMPANIES_STORAGE_KEY, JSON.stringify(clean));
    }
    return clean;
  } catch (e) {
    console.error('Error reading companies from storage:', e);
    return [];
  }
};

export const setStoredCompanies = (companies) => {
  try {
    const clean = deduplicateCompanies(
      (companies || [])
        .filter((c) => !isLegacyMockCompany(c))
        .map((c, idx) => normalizeCompany(c, idx))
    );
    localStorage.setItem(COMPANIES_STORAGE_KEY, JSON.stringify(clean));
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
  getCompanies: async () => {
    try {
      // Direct network call to third-party API (JSONPlaceholder)
      const response = await api.get('/users');
      const apiUsers = response.data || [];

      // Transform API users to full Company Schema
      const apiCompanies = apiUsers.map((user, idx) => mapApiUserToCompany(user, idx));

      // Overlay user additions / modifications stored in local cache
      const stored = getStoredCompanies();
      const userAdded = stored.filter(
        (c) => !isLegacyMockCompany(c) && !apiCompanies.some((ac) => String(ac.id) === String(c.id))
      );
      const userModifiedMap = new Map();
      stored.forEach((c) => {
        if (!isLegacyMockCompany(c)) userModifiedMap.set(String(c.id), c);
      });

      const merged = apiCompanies.map((ac) => userModifiedMap.get(String(ac.id)) || ac);
      const combined = deduplicateCompanies([...userAdded, ...merged]).map((c, idx) =>
        normalizeCompany(c, idx)
      );

      setStoredCompanies(combined);
      return combined;
    } catch (error) {
      console.warn('API fetch failed, falling back to cache:', error);
      return getStoredCompanies();
    }
  },

  // 2. Company Details Page
  getCompanyById: async (id) => {
    const companies = await companyService.getCompanies();
    let company = companies.find((c) => String(c.id) === String(id));

    if (!company) {
      const numericId = String(id).replace(/[^\d]/g, '') || '1';
      try {
        const res = await api.get(`/users/${numericId}`);
        if (res.data) {
          company = mapApiUserToCompany(res.data, parseInt(numericId, 10));
        }
      } catch (e) {
        console.warn('Third-party API getCompanyById fallback:', e);
      }
    }

    if (!company) {
      throw new Error(`Company with ID "${id}" was not found.`);
    }
    return company;
  },

  // 3. Add Company (POST to third-party API & syncs with Local Storage)
  addCompany: async (companyData) => {
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

    const currentCompanies = getStoredCompanies();
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

  // 4. Edit Company (PUT to third-party API & syncs with Local Storage)
  updateCompany: async (id, companyData) => {
    const numericId = String(id).replace(/[^\d]/g, '');
    try {
      if (numericId) {
        await api.put(`/users/${numericId}`, companyData);
      }
    } catch (e) {
      console.warn('Third-party API PUT simulated locally:', e);
    }

    const currentCompanies = getStoredCompanies();
    const index = currentCompanies.findIndex((c) => String(c.id) === String(id));

    if (index === -1) {
      throw new Error(`Company not found with ID: ${id}`);
    }

    const existing = currentCompanies[index];
    const updatedCompany = {
      ...existing,
      name: companyData.name !== undefined ? companyData.name.trim() : existing.name,
      logo: companyData.logo !== undefined ? companyData.logo.trim() : existing.logo,
      logoText: (companyData.name || existing.name).trim().substring(0, 2).toUpperCase(),
      industry: companyData.industry || existing.industry,
      location: companyData.location !== undefined ? companyData.location.trim() : existing.location,
      website: companyData.website !== undefined ? companyData.website.trim() : existing.website,
      contactEmail: companyData.contactEmail !== undefined ? companyData.contactEmail.trim().toLowerCase() : existing.contactEmail,
      employees: companyData.employees || existing.employees,
      description: companyData.description !== undefined ? companyData.description.trim() : existing.description,
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
      badgeColor: 'emerald',
      iconName: 'Building2',
    });

    return updatedCompany;
  },

  // 5. Delete Company (DELETE to third-party API & syncs with Local Storage)
  deleteCompany: async (id) => {
    const numericId = String(id).replace(/[^\d]/g, '');
    try {
      if (numericId) {
        await api.delete(`/users/${numericId}`);
      }
    } catch (e) {
      console.warn('Third-party API DELETE simulated locally:', e);
    }

    const currentCompanies = getStoredCompanies();
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
