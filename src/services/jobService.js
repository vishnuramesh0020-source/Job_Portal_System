import api from './api';
import { formatSalaryWithSymbol } from '../utils/formatSalary';

const JOBS_STORAGE_KEY = 'job_portal_jobs';
const ACTIVITIES_STORAGE_KEY = 'job_portal_recent_activities';

export const JOB_CATEGORIES = [
  'Engineering',
  'Design & Creative',
  'Product Management',
  'Cloud & DevOps',
  'Data & AI',
  'Marketing',
  'Cybersecurity',
  'Mobile Development',
  'Finance & Accounting',
  'Sales & Operations',
];

export const EMPLOYMENT_TYPES = [
  'Full-time',
  'Part-time',
  'Contract',
  'Internship',
  'Freelance',
];

export const EXPERIENCE_LEVELS = [
  'Entry Level',
  'Mid Level',
  'Senior Level',
  'Lead / Manager',
  'Director / Executive',
];

export const JOB_STATUSES = [
  'Open',
  'Closed',
];

export const LOCATION_TYPES = [
  'Remote',
  'Hybrid',
  'On-site',
];

export const POPULAR_SKILLS = [
  'React',
  'JavaScript',
  'TypeScript',
  'Node.js',
  'Tailwind CSS',
  'Python',
  'AWS',
  'Docker',
  'Kubernetes',
  'GraphQL',
  'Next.js',
  'Figma',
  'UI/UX',
  'SQL',
  'PostgreSQL',
  'REST APIs',
  'CI/CD',
  'Git',
  'Agile',
  'DevOps',
];

// Helper to map API company names by user ID from JSONPlaceholder /users
const getApiCompanyNameById = (userId) => {
  const apiCompaniesMap = {
    1: 'Romaguera-Crona',
    2: 'Deckow-Crist',
    3: 'Romaguera-Jacobson',
    4: 'Robel-Corkery',
    5: 'Keebler LLC',
    6: 'Considine-Lockman',
    7: 'Johns Group',
    8: 'Abernathy Group',
    9: 'Yost and Sons',
    10: 'Hoeger LLC',
  };
  return apiCompaniesMap[userId] || `Company ${userId}`;
};

// Map a third-party API post (JSONPlaceholder /posts) to a comprehensive Job Object
export const mapApiPostToJob = (post, index) => {
  const companyName = getApiCompanyNameById(post.userId || (index % 10) + 1);
  const companyId = `comp-api-${post.userId || (index % 10) + 1}`;

  // Clean and format post title directly from API response
  const rawTitle = post.title || 'Software Engineer';
  const cleanTitle = rawTitle.charAt(0).toUpperCase() + rawTitle.slice(1);

  const categories = [
    'Engineering',
    'Cloud & DevOps',
    'Design & Creative',
    'Data & AI',
    'Product Management',
    'Cybersecurity',
    'Marketing',
    'Mobile Development',
  ];
  const category = categories[index % categories.length];

  const locations = [
    'Bengaluru, India',
    'Hyderabad, India',
    'Pune, India',
    'Mumbai, India',
    'Remote, India',
    'Delhi NCR, India',
    'Chennai, India',
    'San Francisco, CA',
  ];
  const location = locations[index % locations.length];
  const locationTypes = ['Remote', 'Hybrid', 'On-site'];
  const locationType = locationTypes[index % locationTypes.length];
  const expLevels = ['Senior Level', 'Lead / Manager', 'Mid Level', 'Entry Level'];
  const experienceLevel = expLevels[index % expLevels.length];
  const empTypes = ['Full-time', 'Full-time', 'Contract', 'Part-time'];
  const employmentType = empTypes[index % empTypes.length];

  const salaryRanges = [
    '₹18,00,000 - ₹24,00,000',
    '₹22,00,000 - ₹30,00,000',
    '₹14,00,000 - ₹20,00,000',
    '₹25,00,000 - ₹35,00,000',
    '₹16,00,000 - ₹22,00,000',
    '₹12,00,000 - ₹16,00,000',
    '₹8,00,000 - ₹11,00,000',
    '₹28,00,000 - ₹38,00,000',
  ];
  const salary = salaryRanges[index % salaryRanges.length];
  const applicants = 10 + ((index * 7) % 36);
  const status = index % 6 === 0 ? 'Closed' : 'Open';

  const cleanBody = post.body
    ? post.body.charAt(0).toUpperCase() + post.body.slice(1)
    : 'Exciting career opportunity at our growing company.';

  return {
    id: `job-api-${post.id}`,
    apiId: post.id,
    title: cleanTitle,
    company: companyName,
    companyId: companyId,
    category: category,
    employmentType: employmentType,
    type: employmentType,
    experienceLevel: experienceLevel,
    salaryRange: salary,
    salary: salary,
    location: location,
    locationType: locationType,
    skills: ['React', 'TypeScript', 'Node.js', 'Tailwind CSS', 'REST APIs', 'Git'],
    deadline: '2026-12-31',
    status: status,
    applicantsCount: applicants,
    postedDate: '2026-04-15',
    description: `${cleanBody}. Join ${companyName} to build scalable modern web platforms.`,
    requirements: '3+ years of relevant industry experience. Proven proficiency with web engineering tools, API integrations, and collaborative team communication.',
    responsibilities: 'Design and maintain high quality software features. Participate in technical design discussions and conduct peer code reviews.',
    contactEmail: `careers@${companyName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
  };
};

// Strict deduplication by ID and Title+Company to guarantee 0 duplicate jobs
export const deduplicateJobs = (jobsList) => {
  if (!Array.isArray(jobsList)) return [];
  const seenIds = new Set();
  const seenCombos = new Set();

  return jobsList.filter((job) => {
    if (!job) return false;
    const idKey = String(job.id || '').trim();
    const title = (job.title || '').trim().toLowerCase();
    const company = (job.company || '').trim().toLowerCase();
    const comboKey = `${title}__${company}`;

    if (idKey && seenIds.has(idKey)) return false;
    if (title && company && seenCombos.has(comboKey)) return false;

    if (idKey) seenIds.add(idKey);
    if (title && company) seenCombos.add(comboKey);
    return true;
  });
};

// Safely retrieve stored jobs from localStorage
const getStoredJobs = () => {
  try {
    const raw = localStorage.getItem(JOBS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? deduplicateJobs(parsed.map(normalizeJob)) : [];
  } catch (error) {
    console.error('Failed to parse jobs from localStorage:', error);
    return [];
  }
};

const setStoredJobs = (jobs) => {
  try {
    const clean = deduplicateJobs(jobs);
    localStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(clean));
  } catch (error) {
    console.error('Failed to save jobs to localStorage:', error);
  }
};

// Normalize job fields
export const normalizeJob = (job) => {
  const normStatus = job.status === 'Active' || job.status === 'Open' ? 'Open' : 'Closed';
  const normType = job.employmentType || job.type || 'Full-time';
  const normSalary = formatSalaryWithSymbol(job.salaryRange || job.salary || '12,00,000 - 18,00,000');
  let normSkills = job.skills;
  if (!normSkills) {
    normSkills = ['React', 'JavaScript', 'Problem Solving'];
  } else if (typeof normSkills === 'string') {
    normSkills = normSkills.split(',').map((s) => s.trim()).filter(Boolean);
  }

  return {
    ...job,
    employmentType: normType,
    type: normType,
    experienceLevel: job.experienceLevel || 'Mid Level',
    salaryRange: normSalary,
    salary: normSalary,
    location: job.location || 'Remote, India',
    locationType: job.locationType || (job.location?.toLowerCase().includes('remote') ? 'Remote' : 'Hybrid'),
    skills: normSkills,
    deadline: job.deadline || '2026-12-31',
    status: normStatus,
    applicantsCount: job.applicantsCount || 0,
    postedDate: job.postedDate || new Date().toISOString().split('T')[0],
    description: job.description || 'Exciting career opportunity at our growing company.',
    requirements: job.requirements || 'Strong relevant background, technical skills, and commitment to teamwork.',
    responsibilities: job.responsibilities || 'Develop software solutions, collaborate with peers, and maintain product quality.',
  };
};

const logActivity = (activity) => {
  try {
    const raw = localStorage.getItem(ACTIVITIES_STORAGE_KEY);
    const list = raw ? JSON.parse(raw) : [];
    const updated = [activity, ...list.slice(0, 9)];
    localStorage.setItem(ACTIVITIES_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Error logging job activity:', e);
  }
};

export const jobService = {
  // 1. Get all jobs dynamically using third-party API (Axios -> JSONPlaceholder /posts)
  getJobs: async () => {
    try {
      // Direct network call to third-party API
      const response = await api.get('/posts?_limit=24');
      const apiPosts = response.data || [];

      // Transform third-party API posts to full dynamic job schema
      const mappedApiJobs = apiPosts.map((post, idx) => mapApiPostToJob(post, idx));

      // Overlay user additions / modifications stored in local cache
      const stored = getStoredJobs();
      const userAdded = stored.filter((j) => !mappedApiJobs.some((m) => String(m.id) === String(j.id)));
      const userModifiedMap = new Map();
      stored.forEach((j) => userModifiedMap.set(String(j.id), j));

      const merged = mappedApiJobs.map((m) => userModifiedMap.get(String(m.id)) || m);
      const combined = deduplicateJobs([...userAdded, ...merged]);

      setStoredJobs(combined);
      return combined;
    } catch (error) {
      console.warn('Third-party API getJobs network fallback to cache:', error);
      return getStoredJobs();
    }
  },

  // 2. View Job Details by ID with third-party API lookup
  getJobById: async (id) => {
    const currentJobs = getStoredJobs();
    let job = currentJobs.find((j) => String(j.id) === String(id));

    if (!job) {
      // Dynamic fetch from third-party API
      const numericId = String(id).replace(/[^\d]/g, '') || '1';
      try {
        const response = await api.get(`/posts/${numericId}`);
        if (response.data) {
          job = mapApiPostToJob(response.data, parseInt(numericId, 10));
        }
      } catch (e) {
        console.warn('Third-party API getJobById fallback:', e);
      }
    }

    if (!job) {
      throw new Error(`Job posting with ID "${id}" was not found.`);
    }
    return job;
  },

  // 3. Create Job Posting with real third-party API POST
  createJob: async (jobData) => {
    let apiResponse = null;
    try {
      apiResponse = await api.post('/posts', {
        title: jobData.title,
        body: jobData.description,
        userId: 1,
      });
    } catch (e) {
      console.warn('Third-party API POST simulated locally:', e);
    }

    const currentJobs = getStoredJobs();
    const newId = `job-api-${Date.now()}`;

    let parsedSkills = jobData.skills;
    if (typeof parsedSkills === 'string') {
      parsedSkills = parsedSkills.split(',').map((s) => s.trim()).filter(Boolean);
    } else if (!Array.isArray(parsedSkills)) {
      parsedSkills = [];
    }

    const salaryString = formatSalaryWithSymbol(
      jobData.salaryRange?.trim() || jobData.salary?.trim() || '12,00,000 - 18,00,000'
    );
    const normType = jobData.employmentType || jobData.type || 'Full-time';
    const normStatus = jobData.status || 'Open';

    const newJob = {
      id: newId,
      apiId: apiResponse?.data?.id || Math.floor(Math.random() * 1000) + 101,
      title: jobData.title.trim(),
      company: jobData.company?.trim() || 'Romaguera-Crona',
      companyId: jobData.companyId || 'comp-api-1',
      category: jobData.category || 'Engineering',
      employmentType: normType,
      type: normType,
      experienceLevel: jobData.experienceLevel || 'Mid Level',
      salaryRange: salaryString,
      salary: salaryString,
      location: jobData.location?.trim() || 'Remote, India',
      locationType: jobData.locationType || 'Remote',
      skills: parsedSkills.length > 0 ? parsedSkills : ['React', 'JavaScript'],
      deadline: jobData.deadline || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      status: normStatus,
      applicantsCount: 0,
      postedDate: new Date().toISOString().split('T')[0],
      description: jobData.description?.trim() || 'Exciting career opportunity at our growing company.',
      requirements: jobData.requirements?.trim() || 'Strong relevant background, technical skills, and commitment to teamwork.',
      responsibilities: jobData.responsibilities?.trim() || 'Develop software solutions, collaborate with peers, and maintain product quality.',
      contactEmail: jobData.contactEmail?.trim() || 'careers@romaguera-crona.com',
    };

    const updated = [newJob, ...currentJobs];
    setStoredJobs(updated);

    logActivity({
      id: `act-${Date.now()}`,
      type: 'job',
      title: 'New Job Posting Published',
      description: `${newJob.company} created a new position: "${newJob.title}".`,
      timestamp: 'Just now',
      badge: 'New Job',
      badgeColor: 'emerald',
      iconName: 'Briefcase',
    });

    return newJob;
  },

  // 4. Update Job with third-party API PUT
  updateJob: async (id, jobData) => {
    const numericId = String(id).replace(/[^\d]/g, '');
    try {
      if (numericId) {
        await api.put(`/posts/${numericId}`, {
          title: jobData.title,
          body: jobData.description,
          userId: 1,
        });
      }
    } catch (e) {
      console.warn('Third-party API PUT simulated locally:', e);
    }

    const currentJobs = getStoredJobs();
    const index = currentJobs.findIndex((j) => String(j.id) === String(id));

    if (index === -1) {
      throw new Error(`Job not found with ID: ${id}`);
    }

    const existing = currentJobs[index];
    let parsedSkills = jobData.skills !== undefined ? jobData.skills : existing.skills;
    if (typeof parsedSkills === 'string') {
      parsedSkills = parsedSkills.split(',').map((s) => s.trim()).filter(Boolean);
    }

    const normType = jobData.employmentType || jobData.type || existing.employmentType || 'Full-time';
    const normStatus = jobData.status || existing.status || 'Open';

    const updatedJob = {
      ...existing,
      title: jobData.title !== undefined ? jobData.title.trim() : existing.title,
      company: jobData.company !== undefined ? jobData.company.trim() : existing.company,
      category: jobData.category !== undefined ? jobData.category : existing.category,
      employmentType: normType,
      type: normType,
      experienceLevel: jobData.experienceLevel !== undefined ? jobData.experienceLevel : existing.experienceLevel,
      salaryRange: jobData.salaryRange !== undefined
        ? formatSalaryWithSymbol(jobData.salaryRange)
        : existing.salaryRange,
      salary: jobData.salaryRange !== undefined
        ? formatSalaryWithSymbol(jobData.salaryRange)
        : existing.salary,
      location: jobData.location !== undefined ? jobData.location.trim() : existing.location,
      locationType: jobData.locationType !== undefined ? jobData.locationType : existing.locationType,
      skills: parsedSkills,
      deadline: jobData.deadline !== undefined ? jobData.deadline : existing.deadline,
      status: normStatus,
      description: jobData.description !== undefined ? jobData.description.trim() : existing.description,
      requirements: jobData.requirements !== undefined ? jobData.requirements.trim() : existing.requirements,
      responsibilities: jobData.responsibilities !== undefined ? jobData.responsibilities.trim() : existing.responsibilities,
      contactEmail: jobData.contactEmail !== undefined ? jobData.contactEmail.trim() : existing.contactEmail,
      updatedAt: new Date().toISOString(),
    };

    currentJobs[index] = updatedJob;
    setStoredJobs(currentJobs);

    logActivity({
      id: `act-${Date.now()}`,
      type: 'job',
      title: 'Job Posting Updated',
      description: `Listing "${updatedJob.title}" at ${updatedJob.company} was modified.`,
      timestamp: 'Just now',
      badge: 'Job Edit',
      badgeColor: 'emerald',
      iconName: 'Briefcase',
    });

    return updatedJob;
  },

  // 5. Delete Job with third-party API DELETE
  deleteJob: async (id) => {
    const numericId = String(id).replace(/[^\d]/g, '');
    try {
      if (numericId) {
        await api.delete(`/posts/${numericId}`);
      }
    } catch (e) {
      console.warn('Third-party API DELETE simulated locally:', e);
    }

    const currentJobs = getStoredJobs();
    const target = currentJobs.find((j) => String(j.id) === String(id));
    const filtered = currentJobs.filter((j) => String(j.id) !== String(id));

    setStoredJobs(filtered);

    if (target) {
      logActivity({
        id: `act-${Date.now()}`,
        type: 'job',
        title: 'Job Posting Removed',
        description: `Position "${target.title}" at ${target.company} was closed and removed.`,
        timestamp: 'Just now',
        badge: 'Deleted',
        badgeColor: 'rose',
        iconName: 'Briefcase',
      });
    }

    return { success: true, deletedId: id };
  },
};

export default jobService;
