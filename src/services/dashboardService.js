import {
  initialCompanies,
  initialJobs,
  initialCandidates,
  initialApplications,
  initialSavedJobs,
  initialRecentActivities,
  monthlyTrends,
  categoryBreakdown,
  applicationStatusStages,
} from '../data/mockDashboardData';

const COMPANIES_KEY = 'job_portal_companies';
const JOBS_KEY = 'job_portal_jobs';
const CANDIDATES_KEY = 'job_portal_candidates';
const APPLICATIONS_KEY = 'job_portal_applications';
const SAVED_JOBS_KEY = 'job_portal_saved_jobs';
const ACTIVITIES_KEY = 'job_portal_recent_activities';

// Helper to safely read from localStorage
const getFromStorage = (key, fallback) => {
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

// Initialize default data if not already set
export const initializeDashboardStorage = () => {
  if (!localStorage.getItem(COMPANIES_KEY)) {
    setToStorage(COMPANIES_KEY, initialCompanies);
  }
  if (!localStorage.getItem(JOBS_KEY)) {
    setToStorage(JOBS_KEY, initialJobs);
  }
  if (!localStorage.getItem(CANDIDATES_KEY)) {
    setToStorage(CANDIDATES_KEY, initialCandidates);
  }
  if (!localStorage.getItem(APPLICATIONS_KEY)) {
    setToStorage(APPLICATIONS_KEY, initialApplications);
  }
  if (!localStorage.getItem(SAVED_JOBS_KEY)) {
    setToStorage(SAVED_JOBS_KEY, initialSavedJobs);
  }
  if (!localStorage.getItem(ACTIVITIES_KEY)) {
    setToStorage(ACTIVITIES_KEY, initialRecentActivities);
  }
};

export const dashboardService = {
  // Retrieve all aggregated statistics and lists
  getDashboardData: () => {
    initializeDashboardStorage();

    const companies = getFromStorage(COMPANIES_KEY, initialCompanies);
    const jobs = getFromStorage(JOBS_KEY, initialJobs);
    const candidates = getFromStorage(CANDIDATES_KEY, initialCandidates);
    const applications = getFromStorage(APPLICATIONS_KEY, initialApplications);
    const savedJobIds = getFromStorage(SAVED_JOBS_KEY, initialSavedJobs);
    const recentActivities = getFromStorage(ACTIVITIES_KEY, initialRecentActivities);

    const activeJobs = jobs.filter((j) => j.status === 'Active');
    const savedJobsList = jobs.filter((j) => savedJobIds.includes(j.id));

    return {
      // 1. Total Companies
      totalCompanies: companies.length,
      // 2. Total Jobs
      totalJobs: jobs.length,
      // 3. Active Job Postings
      activeJobPostings: activeJobs.length,
      // 4. Total Candidates
      totalCandidates: candidates.length,
      // 5. Total Applications
      totalApplications: applications.length,
      // 6. Saved Jobs count & list
      savedJobsCount: savedJobIds.length,
      savedJobs: savedJobsList,
      savedJobIds,
      // 7. Recent Activities
      recentActivities,
      // 8. Raw arrays for cards and quick interactions
      companies,
      jobs,
      activeJobs,
      candidates,
      applications,
      // 9. Dashboard Statistics charts & breakdowns
      monthlyTrends,
      categoryBreakdown,
      applicationStatusStages,
    };
  },

  // Toggle Save / Unsave a job
  toggleSaveJob: (jobId, jobTitle = 'Job Position') => {
    initializeDashboardStorage();
    let savedJobIds = getFromStorage(SAVED_JOBS_KEY, initialSavedJobs);
    let activities = getFromStorage(ACTIVITIES_KEY, initialRecentActivities);
    const isCurrentlySaved = savedJobIds.includes(jobId);

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

  // Quick Post a new Job (Recruiter Action)
  postNewJob: (jobData) => {
    initializeDashboardStorage();
    const jobs = getFromStorage(JOBS_KEY, initialJobs);
    let activities = getFromStorage(ACTIVITIES_KEY, initialRecentActivities);

    const newJob = {
      id: `job-${Date.now()}`,
      title: jobData.title,
      company: jobData.company || 'TechCorp Solutions',
      companyId: 'comp-1',
      category: jobData.category || 'Engineering',
      location: jobData.location || 'Remote, US',
      type: jobData.type || 'Full-Time',
      salary: jobData.salary || '$100,000 - $130,000',
      status: 'Active',
      applicantsCount: 0,
      postedDate: new Date().toISOString().split('T')[0],
      description: jobData.description || 'Exciting career opportunity at our growing company.',
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
      badgeColor: 'indigo',
      iconName: 'Briefcase',
    };

    activities = [newActivity, ...activities.slice(0, 9)];
    setToStorage(ACTIVITIES_KEY, activities);

    return newJob;
  },

  // Quick Apply to a Job (Candidate Action)
  applyToJob: (jobId, applicantData) => {
    initializeDashboardStorage();
    const jobs = getFromStorage(JOBS_KEY, initialJobs);
    const applications = getFromStorage(APPLICATIONS_KEY, initialApplications);
    let activities = getFromStorage(ACTIVITIES_KEY, initialRecentActivities);

    const jobIndex = jobs.findIndex((j) => j.id === jobId);
    const targetJob = jobs[jobIndex] || { title: 'General Application', company: 'Partner Employer' };

    if (jobIndex !== -1) {
      jobs[jobIndex].applicantsCount = (jobs[jobIndex].applicantsCount || 0) + 1;
      setToStorage(JOBS_KEY, jobs);
    }

    const newApplication = {
      id: `app-${Date.now()}`,
      candidateId: applicantData.candidateId || 'cand-user',
      candidateName: applicantData.candidateName || 'Applicant',
      candidateEmail: applicantData.candidateEmail || 'candidate@example.com',
      jobId: jobId,
      jobTitle: targetJob.title,
      company: targetJob.company,
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

  // Reset to initial demo mock data
  resetToDefaults: () => {
    setToStorage(COMPANIES_KEY, initialCompanies);
    setToStorage(JOBS_KEY, initialJobs);
    setToStorage(CANDIDATES_KEY, initialCandidates);
    setToStorage(APPLICATIONS_KEY, initialApplications);
    setToStorage(SAVED_JOBS_KEY, initialSavedJobs);
    setToStorage(ACTIVITIES_KEY, initialRecentActivities);
    return dashboardService.getDashboardData();
  },
};

export default dashboardService;
