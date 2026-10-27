import { useState, useCallback } from 'react';
import { DashboardContext } from './dashboardContextInstance';
import { dashboardService } from '../services/dashboardService';
import { toast } from 'react-toastify';

export const DashboardProvider = ({ children }) => {
  const [data, setData] = useState(() => dashboardService.getDashboardData());
  const [loading, setLoading] = useState(false);

  // Refresh dashboard metrics from localStorage
  const refreshData = useCallback(() => {
    setLoading(true);
    const updated = dashboardService.getDashboardData();
    setData(updated);
    setLoading(false);
  }, []);

  // Toggle Save Job
  const toggleSaveJob = useCallback((jobId, jobTitle) => {
    const res = dashboardService.toggleSaveJob(jobId, jobTitle);
    refreshData();
    if (res.isSaved) {
      toast.success(`Job saved to watchlist!`);
    } else {
      toast.info(`Job removed from saved.`);
    }
    return res;
  }, [refreshData]);

  // Quick Post Job
  const postNewJob = useCallback((jobData) => {
    try {
      const created = dashboardService.postNewJob(jobData);
      refreshData();
      toast.success(`Job "${created.title}" successfully posted!`);
      return { success: true, job: created };
    } catch (e) {
      toast.error('Failed to post job. Please try again.');
      return { success: false, error: e.message };
    }
  }, [refreshData]);

  // Quick Apply to Job
  const applyToJob = useCallback((jobId, applicantData) => {
    try {
      const app = dashboardService.applyToJob(jobId, applicantData);
      refreshData();
      toast.success(`Application submitted for "${app.jobTitle}"!`);
      return { success: true, application: app };
    } catch (e) {
      toast.error('Failed to submit application.');
      return { success: false, error: e.message };
    }
  }, [refreshData]);

  // Withdraw Application (Candidate Action)
  const withdrawApplication = useCallback((applicationId, reason) => {
    try {
      const updated = dashboardService.withdrawApplication(applicationId, reason);
      refreshData();
      toast.info(`Application for "${updated.jobTitle}" has been withdrawn.`);
      return { success: true, application: updated };
    } catch (e) {
      toast.error('Failed to withdraw application.');
      return { success: false, error: e.message };
    }
  }, [refreshData]);

  // Reset to initial mock data
  const resetToDefaults = useCallback(() => {
    const defaults = dashboardService.resetToDefaults();
    setData(defaults);
    toast.info('Dashboard metrics reset to defaults.');
  }, []);

  const value = {
    ...data,
    loading,
    refreshData,
    toggleSaveJob,
    postNewJob,
    applyToJob,
    withdrawApplication,
    resetToDefaults,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

export default DashboardProvider;
