import { initialJobs } from '../data/mockDashboardData';
import { formatSalaryWithSymbol } from '../utils/formatSalary';

const JOBS_STORAGE_KEY = 'job_portal_jobs';
const ACTIVITIES_STORAGE_KEY = 'job_portal_recent_activities';
const SAVED_JOBS_STORAGE_KEY = 'job_portal_saved_jobs';

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

// Helper to safely get stored jobs
const getStoredJobs = () => {
  try {
    const raw = localStorage.getItem(JOBS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(initialJobs));
      return initialJobs.map(normalizeJob);
    }
    const parsed = JSON.parse(raw);
    let needsMigration = false;
    const normalized = parsed.map((j) => {
      const orig = j.salaryRange || j.salary || '';
      const norm = normalizeJob(j);
      if (norm.salary !== orig) needsMigration = true;
      return norm;
    });
    if (needsMigration) {
      setStoredJobs(normalized);
    }
    return normalized;
  } catch (error) {
    console.error('Failed to parse jobs from localStorage:', error);
    return initialJobs.map(normalizeJob);
  }
};

const setStoredJobs = (jobs) => {
  try {
    localStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(jobs));
  } catch (error) {
    console.error('Failed to save jobs to localStorage:', error);
  }
};

// Normalize legacy or partially populated job objects
const normalizeJob = (job) => {
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
    location: job.location || 'Remote, US',
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
  // 1. Get all jobs with optional filters
  getJobs: async () => {
    // Small async pause for realistic UX
    await new Promise((resolve) => setTimeout(resolve, 80));
    return getStoredJobs();
  },

  // 2. View Job Details by ID
  getJobById: async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 50));
    const jobs = getStoredJobs();
    const job = jobs.find((j) => String(j.id) === String(id));
    if (!job) {
      throw new Error(`Job posting with ID "${id}" was not found.`);
    }
    return job;
  },

  // 3. Create Job Posting
  createJob: async (jobData) => {
    await new Promise((resolve) => setTimeout(resolve, 150));
    const currentJobs = getStoredJobs();
    const newId = `job-${Date.now()}`;

    let parsedSkills = jobData.skills;
    if (typeof parsedSkills === 'string') {
      parsedSkills = parsedSkills.split(',').map((s) => s.trim()).filter(Boolean);
    } else if (!Array.isArray(parsedSkills)) {
      parsedSkills = [];
    }

    const salaryString = formatSalaryWithSymbol(jobData.salaryRange?.trim() || jobData.salary?.trim() || '12,00,000 - 18,00,000');
    const normType = jobData.employmentType || jobData.type || 'Full-time';
    const normStatus = jobData.status || 'Open';

    const newJob = {
      id: newId,
      title: jobData.title.trim(),
      company: jobData.company?.trim() || 'TechCorp Solutions',
      companyId: jobData.companyId || 'comp-1',
      category: jobData.category || 'Engineering',
      employmentType: normType,
      type: normType,
      experienceLevel: jobData.experienceLevel || 'Mid Level',
      salaryRange: salaryString,
      salary: salaryString,
      location: jobData.location?.trim() || 'Remote, US',
      locationType: jobData.locationType || 'Remote',
      skills: parsedSkills.length > 0 ? parsedSkills : ['React', 'JavaScript'],
      deadline: jobData.deadline || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      status: normStatus,
      description: jobData.description?.trim() || 'Exciting career opportunity at our growing company.',
      requirements: jobData.requirements?.trim() || 'Demonstrated experience in related domain and strong problem-solving mindset.',
      responsibilities: jobData.responsibilities?.trim() || 'Deliver production features and maintain high code quality.',
      contactEmail: jobData.contactEmail?.trim().toLowerCase() || 'careers@company.com',
      applicantsCount: 0,
      postedDate: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
    };

    const updated = [newJob, ...currentJobs];
    setStoredJobs(updated);

    logActivity({
      id: `act-${Date.now()}`,
      type: 'job',
      title: 'New Job Posting Published',
      description: `${newJob.company} published "${newJob.title}" (${newJob.category} • ${newJob.employmentType}).`,
      timestamp: 'Just now',
      badge: 'New Job',
      badgeColor: 'indigo',
      iconName: 'Briefcase',
    });

    return newJob;
  },

  // 4. Edit Job
  updateJob: async (id, jobData) => {
    await new Promise((resolve) => setTimeout(resolve, 150));
    const currentJobs = getStoredJobs();
    const index = currentJobs.findIndex((j) => String(j.id) === String(id));

    if (index === -1) {
      throw new Error(`Job posting with ID "${id}" was not found.`);
    }

    const existing = currentJobs[index];

    let parsedSkills = jobData.skills !== undefined ? jobData.skills : existing.skills;
    if (typeof parsedSkills === 'string') {
      parsedSkills = parsedSkills.split(',').map((s) => s.trim()).filter(Boolean);
    }

    const salaryString =
      jobData.salaryRange?.trim() ||
      jobData.salary?.trim() ||
      existing.salaryRange ||
      existing.salary;

    const normType = jobData.employmentType || jobData.type || existing.employmentType || existing.type;
    const normStatus = jobData.status || existing.status;

    const updatedJob = {
      ...existing,
      title: jobData.title !== undefined ? jobData.title.trim() : existing.title,
      company: jobData.company !== undefined ? jobData.company.trim() : existing.company,
      companyId: jobData.companyId || existing.companyId,
      category: jobData.category || existing.category,
      employmentType: normType,
      type: normType,
      experienceLevel: jobData.experienceLevel || existing.experienceLevel,
      salaryRange: salaryString,
      salary: salaryString,
      location: jobData.location !== undefined ? jobData.location.trim() : existing.location,
      locationType: jobData.locationType || existing.locationType,
      skills: Array.isArray(parsedSkills) ? parsedSkills : existing.skills,
      deadline: jobData.deadline || existing.deadline,
      status: normStatus,
      description: jobData.description !== undefined ? jobData.description.trim() : existing.description,
      requirements: jobData.requirements !== undefined ? jobData.requirements.trim() : existing.requirements,
      responsibilities: jobData.responsibilities !== undefined ? jobData.responsibilities.trim() : existing.responsibilities,
      contactEmail: jobData.contactEmail !== undefined ? jobData.contactEmail.trim().toLowerCase() : existing.contactEmail,
      updatedAt: new Date().toISOString(),
    };

    currentJobs[index] = updatedJob;
    setStoredJobs(currentJobs);

    logActivity({
      id: `act-${Date.now()}`,
      type: 'job',
      title: 'Job Posting Updated',
      description: `${updatedJob.company} updated details for "${updatedJob.title}".`,
      timestamp: 'Just now',
      badge: 'Job Edit',
      badgeColor: 'indigo',
      iconName: 'Briefcase',
    });

    return updatedJob;
  },

  // 5. Delete Job
  deleteJob: async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 150));
    const currentJobs = getStoredJobs();
    const target = currentJobs.find((j) => String(j.id) === String(id));
    const filtered = currentJobs.filter((j) => String(j.id) !== String(id));

    setStoredJobs(filtered);

    // Also remove from saved jobs if present
    try {
      const rawSaved = localStorage.getItem(SAVED_JOBS_STORAGE_KEY);
      if (rawSaved) {
        const savedIds = JSON.parse(rawSaved);
        const updatedSaved = savedIds.filter((savedId) => String(savedId) !== String(id));
        localStorage.setItem(SAVED_JOBS_STORAGE_KEY, JSON.stringify(updatedSaved));
      }
    } catch (e) {
      console.error('Error updating saved jobs after deletion:', e);
    }

    if (target) {
      logActivity({
        id: `act-${Date.now()}`,
        type: 'job',
        title: 'Job Posting Removed',
        description: `Position "${target.title}" at ${target.company} was deleted.`,
        timestamp: 'Just now',
        badge: 'Deleted',
        badgeColor: 'rose',
        iconName: 'Briefcase',
      });
    }

    return { success: true, deletedId: id };
  },

  // 6. Toggle Job Status (Open / Closed)
  toggleJobStatus: async (id) => {
    const currentJobs = getStoredJobs();
    const index = currentJobs.findIndex((j) => String(j.id) === String(id));
    if (index === -1) {
      throw new Error(`Job not found with ID: ${id}`);
    }

    const job = currentJobs[index];
    const newStatus = job.status === 'Open' ? 'Closed' : 'Open';
    job.status = newStatus;
    currentJobs[index] = job;
    setStoredJobs(currentJobs);

    logActivity({
      id: `act-${Date.now()}`,
      type: 'status',
      title: `Job Status Changed to ${newStatus}`,
      description: `"${job.title}" at ${job.company} was set to ${newStatus}.`,
      timestamp: 'Just now',
      badge: newStatus === 'Open' ? 'Reopened' : 'Closed',
      badgeColor: newStatus === 'Open' ? 'emerald' : 'rose',
      iconName: 'Briefcase',
    });

    return job;
  },
};

export default jobService;
