import api from './api';
import { formatSalaryWithSymbol } from '../utils/formatSalary';
import { mapApiPostToJob, deduplicateJobs, isLegacyMockJob, normalizeJob } from './jobService';
import { mapApiUserToCompany, deduplicateCompanies, isLegacyMockCompany, normalizeCompany } from './companyService';
import { mapApiUserToCandidate } from './candidateService';

const COMPANIES_KEY = 'job_portal_companies';
const JOBS_KEY = 'job_portal_jobs';
const CANDIDATES_KEY = 'job_portal_candidates';
const APPLICATIONS_KEY = 'job_portal_applications';
const SAVED_JOBS_KEY = 'job_portal_saved_jobs';
const ACTIVITIES_KEY = 'job_portal_recent_activities';

// Helper to safely read from localStorage
const getFromStorage = (key, fallback = []) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error(`Error reading ${key} from storage:`, e);
    return fallback;
  }
};

// Helper to safely write to localStorage
const setToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error writing ${key} to storage:`, e);
  }
};

// Strict deduplication for applications
export const deduplicateApplications = (appsList) => {
  if (!Array.isArray(appsList)) return [];
  const seenIds = new Set();
  const seenCombos = new Set();

  return appsList.filter((app) => {
    if (!app) return false;
    const idKey = String(app.id || '').trim();
    const candidateEmail = (app.candidateEmail || '').trim().toLowerCase();
    const jobId = String(app.jobId || '').trim();
    const comboKey = `${candidateEmail}__${jobId}`;

    if (idKey && seenIds.has(idKey)) return false;
    if (candidateEmail && jobId && seenCombos.has(comboKey)) return false;

    if (idKey) seenIds.add(idKey);
    if (candidateEmail && jobId) seenCombos.add(comboKey);
    return true;
  });
};

// Strict deduplication for candidates
export const deduplicateCandidates = (candList) => {
  if (!Array.isArray(candList)) return [];
  const seenIds = new Set();
  const seenEmails = new Set();

  return candList.filter((cand) => {
    if (!cand) return false;
    const idKey = String(cand.id || '').trim();
    const emailKey = (cand.email || '').trim().toLowerCase();

    if (idKey && seenIds.has(idKey)) return false;
    if (emailKey && seenEmails.has(emailKey)) return false;

    if (idKey) seenIds.add(idKey);
    if (emailKey) seenEmails.add(emailKey);
    return true;
  });
};

// Map third-party API comments (JSONPlaceholder /comments) into candidate applications
const mapApiCommentsToApplications = (comments, jobs) => {
  const statuses = [
    'Application Submitted',
    'Under Review',
    'Shortlisted',
    'Interview Scheduled',
    'Offer Extended',
  ];

  return comments.map((c, idx) => {
    const matchingJob = jobs.find((j) => String(j.id) === `job-api-${c.postId}`) || jobs[idx % (jobs.length || 1)] || {
      id: `job-api-${c.postId}`,
      title: 'Senior Software Engineer',
      company: 'TechCorp Solutions',
      location: 'Remote, US',
      salary: '₹18,00,000 - ₹24,00,000',
    };

    const cleanName = c.name
      .split(' ')
      .slice(0, 2)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');

    const status = statuses[idx % statuses.length];

    return {
      id: `app-api-${c.id}`,
      apiId: c.id,
      candidateId: `cand-api-${c.id}`,
      candidateName: cleanName,
      candidateEmail: c.email.toLowerCase(),
      candidatePhone: `+91 987${(c.id * 111) % 900} 0123`,
      coverNote: c.body,
      jobId: matchingJob.id,
      jobTitle: matchingJob.title,
      company: matchingJob.company,
      location: matchingJob.location || 'Remote, US',
      salary: matchingJob.salaryRange || matchingJob.salary || '₹18,00,000 - ₹24,00,000',
      status: status,
      statusColor: status === 'Shortlisted' ? 'teal' : status === 'Interview Scheduled' ? 'emerald' : 'blue',
      appliedDate: new Date(Date.now() - (idx + 1) * 86400000 * 2).toISOString(),
      matchScore: 82 + ((idx * 7) % 17),
    };
  });
};

// Calculate category breakdown from jobs dynamically (Top 5 + Other Disciplines for clean layout)
const calculateCategoryBreakdown = (jobs) => {
  const counts = {};
  jobs.forEach((job) => {
    const cat = job.category || 'Engineering';
    counts[cat] = (counts[cat] || 0) + 1;
  });

  const total = jobs.length || 1;
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);

  const topCategories = sorted.slice(0, 5);
  const otherCount = sorted.slice(5).reduce((acc, [, count]) => acc + count, 0);

  const categories = topCategories.map(([name, count]) => ({
    name,
    count,
    percentage: Math.round((count / total) * 100),
  }));

  if (otherCount > 0) {
    categories.push({
      name: 'Other Disciplines',
      count: otherCount,
      percentage: Math.max(Math.round((otherCount / total) * 100), 4),
    });
  }

  const tailwindColors = [
    'bg-emerald-800',
    'bg-teal-700',
    'bg-emerald-600',
    'bg-teal-600',
    'bg-amber-600',
    'bg-slate-600',
  ];
  const hexColors = [
    '#065f46',
    '#0f766e',
    '#059669',
    '#0d9488',
    '#d97706',
    '#475569',
  ];

  return categories.map((cat, idx) => ({
    ...cat,
    color: tailwindColors[idx % tailwindColors.length],
    colorHex: hexColors[idx % hexColors.length],
  }));
};

// Calculate application status stages dynamically
const calculateApplicationStatusStages = (applications) => {
  const stages = [
    { label: 'Application Submitted', key: 'Application Submitted', color: 'bg-emerald-800', colorHex: '#065f46' },
    { label: 'Under Review', key: 'Under Review', color: 'bg-teal-700', colorHex: '#0f766e' },
    { label: 'Shortlisted', key: 'Shortlisted', color: 'bg-teal-600', colorHex: '#0d9488' },
    { label: 'Interview Scheduled', key: 'Interview Scheduled', color: 'bg-emerald-600', colorHex: '#059669' },
    { label: 'Offer Extended', key: 'Offer Extended', color: 'bg-amber-600', colorHex: '#d97706' },
  ];

  const total = applications.length || 1;

  return stages.map((stage) => {
    const count = applications.filter(
      (a) => a.status?.toLowerCase() === stage.key.toLowerCase()
    ).length || Math.max(Math.round(total * (stage.key === 'Application Submitted' ? 0.35 : stage.key === 'Under Review' ? 0.25 : stage.key === 'Shortlisted' ? 0.20 : stage.key === 'Interview Scheduled' ? 0.12 : 0.08)), 1);
    return {
      stage: stage.label,
      count,
      percentage: Math.round((count / total) * 100),
      color: stage.color,
      colorHex: stage.colorHex,
    };
  });
};

// Calculate monthly trends dynamically from jobs & applications
const calculateMonthlyTrends = (jobs, applications) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const totalApps = applications.length || 30;
  const totalJobs = jobs.length || 24;

  return months.map((month, idx) => {
    const multipliers = [0.45, 0.58, 0.72, 0.86, 0.98, 1.18];
    const appsInMonth = Math.max(Math.round(totalApps * multipliers[idx] * 0.7), 8);
    const jobsInMonth = Math.max(Math.round(totalJobs * multipliers[idx] * 0.5), 4);
    const hiresInMonth = Math.max(Math.round(appsInMonth * 0.32), 2);

    return {
      month,
      applications: appsInMonth,
      jobs: jobsInMonth,
      hires: hiresInMonth,
      shortlisted: Math.max(Math.round(appsInMonth * 0.45), 3),
    };
  });
};

// Calculate monthly application statistics for Reports table
const calculateMonthlyApplicationStats = (jobs, applications) => {
  const months = [
    'June 2026',
    'May 2026',
    'April 2026',
    'March 2026',
    'February 2026',
    'January 2026',
  ];

  const totalApps = applications.length || 30;
  const totalJobs = jobs.length || 24;
  const growthRates = ['+34.2%', '+29.5%', '+24.1%', '+18.7%', '+14.3%', '+10.5%'];
  const statuses = ['Peak Volume', 'High Demand', 'Strong', 'Strong', 'Moderate', 'Baseline'];

  return months.map((month, idx) => {
    const decay = 1 - (idx * 0.12);
    const jobsPosted = Math.max(Math.round((totalJobs * 0.8) * decay), 4);
    const appCount = Math.max(Math.round((totalApps * 1.5) * decay), 12);
    const interviews = Math.max(Math.round(appCount * 0.42), 3);
    const hired = Math.max(Math.round(interviews * 0.38), 2);
    const conversionRate = `${Math.round((hired / appCount) * 100)}%`;

    return {
      month,
      jobsPosted,
      applications: appCount,
      interviews,
      shortlisted: interviews,
      hires: hired,
      hired,
      conversionRate,
      offerRate: conversionRate,
      growthRate: growthRates[idx % growthRates.length],
      status: statuses[idx % statuses.length],
    };
  });
};

// Calculate work model distribution
const calculateWorkModelDistribution = (jobs) => {
  const total = jobs.length || 1;
  const remote = jobs.filter((j) => j.locationType?.toLowerCase() === 'remote' || j.location?.toLowerCase().includes('remote')).length || Math.round(total * 0.45);
  const hybrid = jobs.filter((j) => j.locationType?.toLowerCase() === 'hybrid' || j.location?.toLowerCase().includes('hybrid')).length || Math.round(total * 0.42);
  const onsite = Math.max(total - remote - hybrid, 0) || Math.round(total * 0.13);

  return [
    {
      type: 'Remote',
      model: 'Remote',
      count: remote,
      percentage: Math.round((remote / total) * 100),
      color: 'bg-emerald-800',
      colorHex: '#065f46',
    },
    {
      type: 'Hybrid',
      model: 'Hybrid',
      count: hybrid,
      percentage: Math.round((hybrid / total) * 100),
      color: 'bg-teal-700',
      colorHex: '#0f766e',
    },
    {
      type: 'On-site',
      model: 'On-site',
      count: onsite,
      percentage: Math.round((onsite / total) * 100),
      color: 'bg-amber-600',
      colorHex: '#d97706',
    },
  ];
};

// Calculate employer hiring volume
const calculateEmployerHiringVolume = (companies, jobs) => {
  return companies.slice(0, 5).map((comp) => {
    const companyJobs = jobs.filter(
      (j) => j.company?.toLowerCase() === comp.name?.toLowerCase() || String(j.companyId) === String(comp.id)
    );
    const activeRoles = companyJobs.length || Math.floor(Math.random() * 3) + 2;
    const applicationsReceived = companyJobs.reduce(
      (acc, j) => acc + (j.applicantsCount || 0),
      0
    ) || (activeRoles * 14 + 18);

    return {
      company: comp.name,
      logoText: comp.logoText || (comp.name ? comp.name.substring(0, 2).toUpperCase() : 'CO'),
      openJobs: activeRoles,
      activeRoles,
      applicationsReceived,
      industry: comp.industry || 'Technology',
    };
  });
};

export const dashboardService = {
  // 1. Get Synchronous Metrics from Cache
  getDashboardData: () => {
    const rawCompanies = getFromStorage(COMPANIES_KEY, []);
    const companies = deduplicateCompanies(
      rawCompanies
        .filter((c) => !isLegacyMockCompany(c))
        .map((c, idx) => normalizeCompany(c, idx))
    );
    const rawJobs = getFromStorage(JOBS_KEY, []);
    const jobs = deduplicateJobs(
      rawJobs
        .filter((j) => !isLegacyMockJob(j))
        .map(normalizeJob)
    );
    const candidates = deduplicateCandidates(getFromStorage(CANDIDATES_KEY, []));
    const applications = deduplicateApplications(getFromStorage(APPLICATIONS_KEY, []));
    const savedJobIds = getFromStorage(SAVED_JOBS_KEY, []);
    const recentActivities = getFromStorage(ACTIVITIES_KEY, []);

    const activeJobs = jobs.filter((j) => j.status === 'Active' || j.status === 'Open');
    const savedJobsList = jobs.filter((j) => savedJobIds.includes(j.id));

    // Dynamic Most Applied Jobs calculation
    const mostAppliedJobs = [...jobs]
      .map((job) => {
        const liveApps = applications.filter((a) => a.jobId === job.id).length;
        const totalApplicants = (job.applicantsCount || 0) + liveApps;
        return {
          ...job,
          totalApplicants,
        };
      })
      .sort((a, b) => b.totalApplicants - a.totalApplicants)
      .slice(0, 6);

    return {
      totalCompanies: companies.length,
      totalJobs: jobs.length,
      activeJobPostings: activeJobs.length,
      totalCandidates: candidates.length,
      totalApplications: applications.length,
      savedJobsCount: savedJobIds.length,
      savedJobs: savedJobsList,
      savedJobIds,
      recentActivities,
      companies,
      jobs,
      activeJobs,
      candidates,
      applications,
      monthlyTrends: calculateMonthlyTrends(jobs, applications),
      categoryBreakdown: calculateCategoryBreakdown(jobs),
      applicationStatusStages: calculateApplicationStatusStages(applications),
      mostAppliedJobs,
      monthlyApplicationStats: calculateMonthlyApplicationStats(jobs, applications),
      employerHiringVolume: calculateEmployerHiringVolume(companies, jobs),
      workModelDistribution: calculateWorkModelDistribution(jobs),
    };
  },

  // 2. Fetch and hydrate all metrics dynamically directly from third-party APIs
  getDashboardDataAsync: async (options = {}) => {
    try {
      const apiConfig = options.bypassCache ? { bypassCache: true } : {};
      const [postsRes, usersRes, commentsRes, todosRes] = await Promise.all([
        api.get('/posts?_limit=24', apiConfig),
        api.get('/users', apiConfig),
        api.get('/comments?_limit=35', apiConfig),
        api.get('/todos?_limit=20', apiConfig),
      ]);

      const apiPosts = postsRes.data || [];
      const apiUsers = usersRes.data || [];
      const apiComments = commentsRes.data || [];
      const apiTodos = todosRes.data || [];

      // Transform API results
      const mappedJobs = apiPosts.map((post, idx) => mapApiPostToJob(post, idx));
      const mappedCompanies = apiUsers.map((user, idx) => mapApiUserToCompany(user, idx));

      // Map candidates from API users
      const mappedCandidates = apiUsers.map((user, idx) => mapApiUserToCandidate(user, idx));

      // Overlay user-created/modified jobs from local cache
      const storedJobs = getFromStorage(JOBS_KEY, []);
      const userCreatedJobs = storedJobs.filter(
        (j) => !isLegacyMockJob(j) && !mappedJobs.some((m) => String(m.id) === String(j.id))
      );
      const userJobMods = new Map();
      storedJobs.forEach((j) => {
        if (!isLegacyMockJob(j)) userJobMods.set(String(j.id), j);
      });
      const combinedJobs = deduplicateJobs([
        ...userCreatedJobs,
        ...mappedJobs.map((m) => userJobMods.get(String(m.id)) || m),
      ]).map(normalizeJob);

      // Overlay user-created/modified companies
      const storedCompanies = getFromStorage(COMPANIES_KEY, []);
      const userCreatedCompanies = storedCompanies.filter(
        (c) => !isLegacyMockCompany(c) && !mappedCompanies.some((m) => String(m.id) === String(c.id))
      );
      const userCompMods = new Map();
      storedCompanies.forEach((c) => {
        if (!isLegacyMockCompany(c)) userCompMods.set(String(c.id), c);
      });
      const combinedCompanies = deduplicateCompanies([
        ...userCreatedCompanies,
        ...mappedCompanies.map((m) => userCompMods.get(String(m.id)) || m),
      ]).map((c, idx) => normalizeCompany(c, idx));

      // Map dynamic applications from API comments
      const apiApplications = mapApiCommentsToApplications(apiComments, combinedJobs);
      const storedApps = getFromStorage(APPLICATIONS_KEY, []);
      const userCreatedApps = storedApps.filter(
        (a) => !apiApplications.some((m) => String(m.id) === String(a.id))
      );
      const userAppMods = new Map();
      storedApps.forEach((a) => userAppMods.set(String(a.id), a));
      const combinedApplications = deduplicateApplications([
        ...userCreatedApps,
        ...apiApplications.map((m) => userAppMods.get(String(m.id)) || m),
      ]);

      const combinedCandidates = deduplicateCandidates(mappedCandidates);

      // Map saved jobs from API todos + local storage
      const storedSaved = getFromStorage(SAVED_JOBS_KEY, []);
      let activeSavedIds = storedSaved;
      if (activeSavedIds.length === 0) {
        activeSavedIds = apiTodos
          .filter((t) => t.completed)
          .slice(0, 4)
          .map((t) => combinedJobs[t.id % combinedJobs.length]?.id)
          .filter(Boolean);
      }

      // Generate dynamic recent activities if none stored
      let activities = getFromStorage(ACTIVITIES_KEY, []);
      if (activities.length === 0) {
        activities = combinedApplications.slice(0, 5).map((app, idx) => ({
          id: `act-${app.id || idx}`,
          type: 'application',
          title: 'Application Received',
          description: `${app.candidateName} applied for "${app.jobTitle}" at ${app.company}.`,
          timestamp: `${idx + 1}h ago`,
          badge: app.status,
          badgeColor: 'teal',
          iconName: 'FileText',
        }));
      }

      // Save to storage cache for fast subsequent renders
      setToStorage(COMPANIES_KEY, combinedCompanies);
      setToStorage(JOBS_KEY, combinedJobs);
      setToStorage(CANDIDATES_KEY, combinedCandidates);
      setToStorage(APPLICATIONS_KEY, combinedApplications);
      setToStorage(SAVED_JOBS_KEY, activeSavedIds);
      setToStorage(ACTIVITIES_KEY, activities);

      const activeJobs = combinedJobs.filter((j) => j.status === 'Active' || j.status === 'Open');
      const savedJobsList = combinedJobs.filter((j) => activeSavedIds.includes(j.id));

      const mostAppliedJobs = [...combinedJobs]
        .map((job) => {
          const liveApps = combinedApplications.filter((a) => a.jobId === job.id).length;
          const totalApplicants = (job.applicantsCount || 0) + liveApps;
          return {
            ...job,
            totalApplicants,
          };
        })
        .sort((a, b) => b.totalApplicants - a.totalApplicants)
        .slice(0, 6);

      return {
        totalCompanies: combinedCompanies.length,
        totalJobs: combinedJobs.length,
        activeJobPostings: activeJobs.length,
        totalCandidates: combinedCandidates.length,
        totalApplications: combinedApplications.length,
        savedJobsCount: activeSavedIds.length,
        savedJobs: savedJobsList,
        savedJobIds: activeSavedIds,
        recentActivities: activities,
        companies: combinedCompanies,
        jobs: combinedJobs,
        activeJobs,
        candidates: combinedCandidates,
        applications: combinedApplications,
        monthlyTrends: calculateMonthlyTrends(combinedJobs, combinedApplications),
        categoryBreakdown: calculateCategoryBreakdown(combinedJobs),
        applicationStatusStages: calculateApplicationStatusStages(combinedApplications),
        mostAppliedJobs,
        monthlyApplicationStats: calculateMonthlyApplicationStats(combinedJobs, combinedApplications),
        employerHiringVolume: calculateEmployerHiringVolume(combinedCompanies, combinedJobs),
        workModelDistribution: calculateWorkModelDistribution(combinedJobs),
      };
    } catch (e) {
      console.warn('Third-party API getDashboardDataAsync fallback to cache:', e);
      return dashboardService.getDashboardData();
    }
  },

  // Toggle Save / Unsave a job with third-party API POST/DELETE
  toggleSaveJob: (jobId, jobTitle = 'Job Position') => {
    let savedJobIds = getFromStorage(SAVED_JOBS_KEY, []);
    let activities = getFromStorage(ACTIVITIES_KEY, []);
    const isCurrentlySaved = savedJobIds.includes(jobId);

    // Call third-party API
    if (isCurrentlySaved) {
      const numericId = String(jobId).replace(/[^\d]/g, '') || '1';
      api.delete(`/todos/${numericId}`).catch((e) => console.warn('API delete todo fallback:', e));
    } else {
      api.post('/todos', { jobId, title: jobTitle, completed: true }).catch((e) => console.warn('API post todo fallback:', e));
    }

    if (isCurrentlySaved) {
      savedJobIds = savedJobIds.filter((id) => id !== jobId);
      activities = [
        {
          id: `act-${Date.now()}`,
          type: 'save',
          title: 'Job Removed from Saved',
          description: `You removed "${jobTitle}" from your saved jobs.`,
          timestamp: 'Just now',
          badge: 'Removed',
          badgeColor: 'amber',
          iconName: 'BookmarkMinus',
        },
        ...activities.slice(0, 9),
      ];
    } else {
      savedJobIds = [jobId, ...savedJobIds];
      activities = [
        {
          id: `act-${Date.now()}`,
          type: 'save',
          title: 'Job Saved to Favorites',
          description: `You saved "${jobTitle}" to your watchlist.`,
          timestamp: 'Just now',
          badge: 'Bookmark',
          badgeColor: 'rose',
          iconName: 'Bookmark',
        },
        ...activities.slice(0, 9),
      ];
    }

    setToStorage(SAVED_JOBS_KEY, savedJobIds);
    setToStorage(ACTIVITIES_KEY, activities);

    return {
      savedJobIds,
      isSaved: !isCurrentlySaved,
    };
  },

  // Quick Post a new Job (Recruiter Action) with third-party API POST
  postNewJob: (jobData) => {
    const jobs = getFromStorage(JOBS_KEY, []);
    let activities = getFromStorage(ACTIVITIES_KEY, []);

    // Call third-party API
    api.post('/posts', {
      title: jobData.title,
      body: jobData.description,
      userId: 1,
    }).catch((e) => console.warn('Third-party API post job fallback:', e));

    const newJob = {
      id: `job-api-${Date.now()}`,
      title: jobData.title,
      company: jobData.company || 'TechCorp Solutions',
      companyId: jobData.companyId || 'comp-api-1',
      category: jobData.category || 'Engineering',
      employmentType: jobData.employmentType || jobData.type || 'Full-time',
      type: jobData.employmentType || jobData.type || 'Full-time',
      experienceLevel: jobData.experienceLevel || 'Mid Level',
      salaryRange: formatSalaryWithSymbol(jobData.salaryRange || jobData.salary || '12,00,000 - 18,00,000'),
      salary: formatSalaryWithSymbol(jobData.salaryRange || jobData.salary || '12,00,000 - 18,00,000'),
      location: jobData.location || 'Remote, US',
      locationType: jobData.locationType || 'Remote',
      skills: Array.isArray(jobData.skills)
        ? jobData.skills
        : typeof jobData.skills === 'string'
        ? jobData.skills.split(',').map((s) => s.trim()).filter(Boolean)
        : ['React', 'JavaScript'],
      deadline: jobData.deadline || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      status: jobData.status || 'Open',
      applicantsCount: 0,
      postedDate: new Date().toISOString().split('T')[0],
      description: jobData.description || 'Exciting career opportunity at our growing company.',
      requirements: jobData.requirements || 'Proven relevant experience and passion for team collaboration.',
      responsibilities: jobData.responsibilities || 'Deliver quality software features and maintain high operational standards.',
    };

    const updatedJobs = [newJob, ...jobs];
    setToStorage(JOBS_KEY, updatedJobs);

    const newActivity = {
      id: `act-${Date.now()}`,
      type: 'job',
      title: 'New Job Posting Published',
      description: `${newJob.company} published a new role: "${newJob.title}" in ${newJob.category}.`,
      timestamp: 'Just now',
      badge: 'New Job',
      badgeColor: 'emerald',
      iconName: 'Briefcase',
    };

    activities = [newActivity, ...activities.slice(0, 9)];
    setToStorage(ACTIVITIES_KEY, activities);

    return newJob;
  },

  // Quick Apply to a Job (Candidate Action) with third-party API POST
  applyToJob: (jobId, applicantData) => {
    const jobs = getFromStorage(JOBS_KEY, []);
    const applications = getFromStorage(APPLICATIONS_KEY, []);
    let activities = getFromStorage(ACTIVITIES_KEY, []);

    const jobIndex = jobs.findIndex((j) => j.id === jobId);
    const targetJob = jobs[jobIndex] || { title: 'General Application', company: 'Partner Employer' };

    if (jobIndex !== -1) {
      jobs[jobIndex].applicantsCount = (jobs[jobIndex].applicantsCount || 0) + 1;
      setToStorage(JOBS_KEY, jobs);
    }

    // Call third-party API POST to /comments
    api.post('/comments', {
      postId: typeof jobId === 'number' ? jobId : 1,
      name: applicantData.candidateName,
      email: applicantData.candidateEmail,
      body: applicantData.coverNote || 'Job application submission',
    }).catch((e) => console.warn('Third-party API applyToJob fallback:', e));

    const newApplication = {
      id: `app-api-${Date.now()}`,
      candidateId: applicantData.candidateId || 'user-cand-1',
      candidateName: applicantData.candidateName || 'Applicant',
      candidateEmail: applicantData.candidateEmail || 'candidate@jobportal.com',
      candidatePhone: applicantData.candidatePhone || '',
      coverNote: applicantData.coverNote || '',
      portfolioUrl: applicantData.portfolioUrl || '',
      jobId: jobId,
      jobTitle: targetJob.title,
      company: targetJob.company,
      location: targetJob.location || 'Remote, US',
      salary: targetJob.salaryRange || targetJob.salary || '₹18,00,000 - ₹24,00,000',
      status: 'Application Submitted',
      statusColor: 'blue',
      appliedDate: new Date().toISOString(),
      matchScore: Math.floor(Math.random() * 15) + 85,
    };

    const updatedApplications = [newApplication, ...applications];
    setToStorage(APPLICATIONS_KEY, updatedApplications);

    const newActivity = {
      id: `act-${Date.now()}`,
      type: 'application',
      title: 'Application Submitted',
      description: `${newApplication.candidateName} applied for "${targetJob.title}" at ${targetJob.company}.`,
      timestamp: 'Just now',
      badge: 'Applied',
      badgeColor: 'blue',
      iconName: 'FileText',
    };

    activities = [newActivity, ...activities.slice(0, 9)];
    setToStorage(ACTIVITIES_KEY, activities);

    return newApplication;
  },

  // Withdraw Application with third-party API PATCH
  withdrawApplication: (applicationId, reason = 'Withdrawn by candidate') => {
    const applications = getFromStorage(APPLICATIONS_KEY, []);
    let activities = getFromStorage(ACTIVITIES_KEY, []);

    const appIndex = applications.findIndex((a) => a.id === applicationId);
    if (appIndex === -1) {
      throw new Error('Application not found');
    }

    const numericId = String(applicationId).replace(/[^\d]/g, '') || '1';
    // Call third-party API PATCH to /comments/:id
    api.patch(`/comments/${numericId}`, {
      status: 'Withdrawn',
      withdrawReason: reason,
    }).catch((e) => console.warn('Third-party API withdraw fallback:', e));

    const targetApp = applications[appIndex];
    const updatedApp = {
      ...targetApp,
      status: 'Withdrawn',
      statusColor: 'slate',
      withdrawnAt: new Date().toISOString(),
      withdrawReason: reason,
    };

    applications[appIndex] = updatedApp;
    setToStorage(APPLICATIONS_KEY, applications);

    const newActivity = {
      id: `act-${Date.now()}`,
      type: 'application',
      title: 'Application Withdrawn',
      description: `${targetApp.candidateName || 'Candidate'} withdrew application for "${targetApp.jobTitle}" at ${targetApp.company}. Reason: ${reason}`,
      timestamp: 'Just now',
      badge: 'Withdrawn',
      badgeColor: 'slate',
      iconName: 'FileText',
    };

    activities = [newActivity, ...activities.slice(0, 9)];
    setToStorage(ACTIVITIES_KEY, activities);

    return updatedApp;
  },

  // Reset to live API data fresh from network
  resetToDefaults: async () => {
    localStorage.removeItem(COMPANIES_KEY);
    localStorage.removeItem(JOBS_KEY);
    localStorage.removeItem(CANDIDATES_KEY);
    localStorage.removeItem(APPLICATIONS_KEY);
    localStorage.removeItem(SAVED_JOBS_KEY);
    localStorage.removeItem(ACTIVITIES_KEY);
    return dashboardService.getDashboardDataAsync();
  },
};

export default dashboardService;
