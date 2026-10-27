// Candidate Profile Service with localStorage persistence and seed profiles

export const CANDIDATE_PROFILES_STORAGE_KEY = 'job_portal_candidate_profiles';

export const initialCandidateProfiles = [
  {
    id: 'user-cand-1',
    fullName: 'Alex Johnson',
    email: 'candidate@jobportal.com',
    mobileNumber: '+91 98765 43210',
    address: '42 Silicon Boulevard, Tech Park, Bengaluru, Karnataka, India - 560100',
    title: 'Senior Frontend Developer',
    bio: 'Passionate frontend engineer with 5+ years of experience crafting high-performance, accessible, and responsive web applications using React, TypeScript, and modern design systems.',
    profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    skills: [
      'React 19',
      'TypeScript',
      'JavaScript (ES6+)',
      'Tailwind CSS',
      'Next.js',
      'Vite',
      'REST APIs',
      'Redux Toolkit',
      'Node.js',
      'UI/UX Design',
    ],
    experience: [
      {
        id: 'exp-1',
        title: 'Senior Frontend Engineer',
        company: 'CloudSphere Global',
        location: 'Remote / Bengaluru',
        startDate: '2023',
        endDate: 'Present',
        isCurrent: true,
        description:
          'Architected responsive enterprise analytics dashboards. Reduced bundle size by 35% with code splitting and modern bundling strategies.',
      },
      {
        id: 'exp-2',
        title: 'Frontend Developer',
        company: 'TechCorp Solutions',
        location: 'Bengaluru, India',
        startDate: '2021',
        endDate: '2023',
        isCurrent: false,
        description:
          'Engineered reusable UI component libraries with React and Tailwind CSS. Implemented automated end-to-end testing, reducing regression bugs by 25%.',
      },
    ],
    education: [
      {
        id: 'edu-1',
        degree: 'B.Tech in Computer Science & Engineering',
        institution: 'National Institute of Technology',
        startYear: '2017',
        endYear: '2021',
        score: '8.9 CGPA / First Class with Distinction',
      },
      {
        id: 'edu-2',
        degree: 'Higher Secondary Certificate (HSC) - Science',
        institution: 'St. Xavier Senior Secondary School',
        startYear: '2015',
        endYear: '2017',
        score: '94.2%',
      },
    ],
    resume: {
      fileName: 'Alex_Johnson_Senior_Frontend_Resume.pdf',
      fileSize: '1.8 MB',
      uploadedAt: '2026-10-20T10:30:00.000Z',
    },
    createdAt: '2026-01-15T08:00:00.000Z',
    updatedAt: '2026-10-26T12:00:00.000Z',
  },
];

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

// Ensure initial candidate storage exists
export const initializeCandidateProfiles = () => {
  try {
    const existing = localStorage.getItem(CANDIDATE_PROFILES_STORAGE_KEY);
    if (!existing) {
      localStorage.setItem(
        CANDIDATE_PROFILES_STORAGE_KEY,
        JSON.stringify(initialCandidateProfiles)
      );
    }
  } catch (error) {
    console.error('Failed to initialize candidate profiles storage:', error);
  }
};

// Retrieve all candidate profiles
export const getAllCandidateProfiles = () => {
  initializeCandidateProfiles();
  try {
    const data = localStorage.getItem(CANDIDATE_PROFILES_STORAGE_KEY);
    return data ? JSON.parse(data) : initialCandidateProfiles;
  } catch (error) {
    console.error('Failed to parse candidate profiles:', error);
    return initialCandidateProfiles;
  }
};

// Get profile by candidate user ID or fallback
export const getCandidateProfile = (userId, fallbackUser = null) => {
  const profiles = getAllCandidateProfiles();
  const profile = profiles.find((p) => p.id === userId);

  if (profile) {
    return profile;
  }

  // If not found, create a baseline profile from the current logged-in user if available
  if (fallbackUser) {
    return {
      id: fallbackUser.id || `user-cand-${Date.now()}`,
      fullName: fallbackUser.fullName || '',
      email: fallbackUser.email || '',
      mobileNumber: fallbackUser.phone || '',
      address: fallbackUser.location || '',
      title: fallbackUser.title || 'Job Seeker',
      bio: fallbackUser.bio || '',
      profilePhoto: AVATAR_PRESETS[0],
      skills: ['React 19', 'JavaScript', 'Tailwind CSS'],
      experience: [],
      education: [],
      resume: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
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
