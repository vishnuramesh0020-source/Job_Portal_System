import api from './api';

// Candidate Profile Service with pure API synchronization and dynamic storage
export const CANDIDATE_PROFILES_STORAGE_KEY = 'job_portal_candidate_profiles';

export const POPULAR_SKILLS = [
  'React 19',
  'TypeScript',
  'JavaScript',
  'Tailwind CSS',
  'Node.js',
  'Next.js',
  'Python',
  'Express.js',
  'PostgreSQL',
  'MongoDB',
  'Docker',
  'AWS',
  'GraphQL',
  'Redux',
  'Git & GitHub',
  'Figma',
  'REST APIs',
  'CI/CD Pipelines',
];

export const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
];

// Retrieve all candidate profiles from localStorage
export const getAllCandidateProfiles = () => {
  try {
    const data = localStorage.getItem(CANDIDATE_PROFILES_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to parse candidate profiles:', error);
    return [];
  }
};

// Create a candidate profile dynamically from API user data or logged in user
export const createProfileFromUser = (user) => {
  if (!user) return null;

  return {
    id: user.id || `user-cand-${Date.now()}`,
    fullName: user.fullName || user.name || 'Candidate',
    email: user.email || '',
    mobileNumber: user.phone || user.mobileNumber || '+91 98765 43210',
    address: user.location || user.address?.city || 'Bengaluru, India',
    title: user.title || user.company?.bs || 'Senior Software Developer',
    bio: user.bio || `${user.fullName || user.name || 'Candidate'} is a software engineering professional with industry experience in React, JavaScript, and modern web application development.`,
    profilePhoto: user.profilePhoto || AVATAR_PRESETS[0],
    skills: user.skills || ['React 19', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'REST APIs', 'Git'],
    experience: user.experience || [
      {
        id: 'exp-1',
        title: user.title || 'Software Engineer',
        company: user.companyName || 'Romaguera-Crona',
        location: user.location || 'Bengaluru, India',
        startDate: '2023',
        endDate: 'Present',
        isCurrent: true,
        description: 'Engineering responsive web applications, optimizing component architecture, and integrating REST API services.',
      },
    ],
    education: user.education || [
      {
        id: 'edu-1',
        degree: 'Bachelor of Technology in Computer Science',
        institution: 'National Institute of Technology',
        startYear: '2018',
        endYear: '2022',
        score: '8.8 CGPA',
      },
    ],
    resume: user.resume || {
      fileName: `${(user.fullName || user.name || 'Candidate').replace(/\s+/g, '_')}_Resume.pdf`,
      fileSize: '1.4 MB',
      uploadedAt: new Date().toISOString(),
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

// Get profile by candidate user ID or fallback
export const getCandidateProfile = (userId, fallbackUser = null) => {
  const profiles = getAllCandidateProfiles();
  const profile = profiles.find((p) => p.id === userId);

  if (profile) {
    return profile;
  }

  // If not found in localStorage, dynamically generate from API fallbackUser
  if (fallbackUser) {
    const newProfile = createProfileFromUser(fallbackUser);
    saveCandidateProfile(newProfile);
    return newProfile;
  }

  return null;
};

// Save (create or update) candidate profile
export const saveCandidateProfile = (profileData) => {
  const profiles = getAllCandidateProfiles();
  const index = profiles.findIndex((p) => p.id === profileData.id);

  const updatedProfile = {
    ...profileData,
    updatedAt: new Date().toISOString(),
  };

  if (index >= 0) {
    profiles[index] = updatedProfile;
  } else {
    updatedProfile.createdAt = new Date().toISOString();
    profiles.push(updatedProfile);
  }

  try {
    localStorage.setItem(
      CANDIDATE_PROFILES_STORAGE_KEY,
      JSON.stringify(profiles)
    );
    // Real Third-Party API PUT synchronization
    api.put('/users/1', {
      name: updatedProfile.fullName,
      email: updatedProfile.email,
      phone: updatedProfile.mobileNumber,
      address: { street: updatedProfile.address },
    }).catch((e) => console.warn('Third-party API candidate profile sync fallback:', e));
  } catch (error) {
    console.error('Failed to save candidate profiles to storage:', error);
  }

  // Also update session user in localStorage to keep navbar / avatar / full name in sync
  try {
    const currentSessionRaw = localStorage.getItem('job_portal_auth_user');
    if (currentSessionRaw) {
      const currentSession = JSON.parse(currentSessionRaw);
      if (currentSession.id === updatedProfile.id) {
        const syncedSession = {
          ...currentSession,
          fullName: updatedProfile.fullName,
          email: updatedProfile.email,
          phone: updatedProfile.mobileNumber,
          location: updatedProfile.address,
          title: updatedProfile.title || currentSession.title,
          bio: updatedProfile.bio || currentSession.bio,
          profilePhoto: updatedProfile.profilePhoto,
        };
        localStorage.setItem(
          'job_portal_auth_user',
          JSON.stringify(syncedSession)
        );
      }
    }

    // Also update in registered users database
    const usersRaw = localStorage.getItem('job_portal_users');
    if (usersRaw) {
      const users = JSON.parse(usersRaw);
      const userIdx = users.findIndex((u) => u.id === updatedProfile.id);
      if (userIdx >= 0) {
        users[userIdx] = {
          ...users[userIdx],
          fullName: updatedProfile.fullName,
          email: updatedProfile.email,
          phone: updatedProfile.mobileNumber,
          location: updatedProfile.address,
          title: updatedProfile.title || users[userIdx].title,
          bio: updatedProfile.bio || users[userIdx].bio,
        };
        localStorage.setItem('job_portal_users', JSON.stringify(users));
      }
    }
  } catch (syncError) {
    console.warn('Failed to sync candidate profile to auth session:', syncError);
  }

  return updatedProfile;
};

// Calculate Profile Completion Percentage
export const calculateProfileCompletion = (profile) => {
  if (!profile) return 0;
  let score = 0;
  const weights = [
    { key: 'fullName', points: 15, valid: !!profile.fullName?.trim() },
    { key: 'email', points: 15, valid: !!profile.email?.trim() },
    { key: 'mobileNumber', points: 10, valid: !!profile.mobileNumber?.trim() },
    { key: 'address', points: 10, valid: !!profile.address?.trim() },
    { key: 'skills', points: 15, valid: Array.isArray(profile.skills) && profile.skills.length > 0 },
    { key: 'experience', points: 15, valid: Array.isArray(profile.experience) && profile.experience.length > 0 },
    { key: 'education', points: 10, valid: Array.isArray(profile.education) && profile.education.length > 0 },
    { key: 'resume', points: 10, valid: !!profile.resume?.fileName },
  ];

  weights.forEach((item) => {
    if (item.valid) score += item.points;
  });

  return Math.min(100, score);
};
