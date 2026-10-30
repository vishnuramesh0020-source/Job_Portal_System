import api from './api';
import { AVATAR_PRESETS } from './candidateProfileService';

const CANDIDATES_STORAGE_KEY = 'job_portal_candidates';
const ACTIVITIES_STORAGE_KEY = 'job_portal_recent_activities';

// Standard technical disciplines & role titles
export const CANDIDATE_TITLES = [
  'Senior Frontend Developer',
  'Full Stack Software Engineer',
  'Lead Backend Engineer (Node/Python)',
  'DevOps & Cloud Systems Architect',
  'Mobile Application Engineer (React Native)',
  'AI / Machine Learning Engineer',
  'UI/UX Technical Product Designer',
  'Staff Platform Engineer',
  'Database & Data Infrastructure Architect',
  'Site Reliability Engineer (SRE)',
];

export const SKILL_POOLS = [
  ['React', 'TypeScript', 'Tailwind CSS', 'Next.js', 'Redux', 'REST APIs'],
  ['Node.js', 'Express', 'PostgreSQL', 'Docker', 'AWS', 'GraphQL'],
  ['Python', 'Django', 'FastAPI', 'Redis', 'Kubernetes', 'CI/CD'],
  ['Go', 'Microservices', 'gRPC', 'Terraform', 'Kafka', 'Linux'],
  ['React Native', 'iOS/Android', 'TypeScript', 'Firebase', 'State Management'],
  ['Python', 'PyTorch', 'TensorFlow', 'NLP', 'Data Pipelines', 'Pandas'],
  ['Figma', 'Design Systems', 'HTML5/CSS3', 'Tailwind CSS', 'Prototyping'],
  ['Java', 'Spring Boot', 'Microservices', 'PostgreSQL', 'Docker', 'AWS'],
  ['MongoDB', 'PostgreSQL', 'Data Warehousing', 'ETL Pipelines', 'SQL'],
  ['AWS', 'GCP', 'Kubernetes', 'Monitoring', 'Terraform', 'Prometheus'],
];

export const EXPERIENCE_LEVELS = [
  'Senior Level (5+ yrs)',
  'Mid Level (3-5 yrs)',
  'Lead Engineer (7+ yrs)',
  'Principal Architect (10+ yrs)',
  'Senior Specialist (6+ yrs)',
];

export const AVAILABILITY_OPTIONS = [
  'Immediate Joiner',
  '15 Days Notice',
  '1 Month Notice',
  'Actively Interviewing',
];

// Helper to log candidate recent activities
const logCandidateActivity = (activity) => {
  try {
    const raw = localStorage.getItem(ACTIVITIES_STORAGE_KEY);
    const list = raw ? JSON.parse(raw) : [];
    const updated = [activity, ...list].slice(0, 10);
    localStorage.setItem(ACTIVITIES_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Error logging candidate activity:', e);
  }
};

// Map a JSONPlaceholder User from /users into a complete Candidate Profile
export const mapApiUserToCandidate = (user, index = 0) => {
  const title = CANDIDATE_TITLES[index % CANDIDATE_TITLES.length];
  const skills = SKILL_POOLS[index % SKILL_POOLS.length];
  const experienceLevel = EXPERIENCE_LEVELS[index % EXPERIENCE_LEVELS.length];
  const availability = AVAILABILITY_OPTIONS[index % AVAILABILITY_OPTIONS.length];
  const avatar = AVATAR_PRESETS[index % AVATAR_PRESETS.length];

  const city = user.address?.city || 'Bengaluru';
  const street = user.address?.street ? `${user.address.street}` : '';
  const fullAddress = street ? `${street}, ${city}` : `${city}`;
  const companyName = user.company?.name || 'TechCorp Engineering';
  const headline = user.company?.catchPhrase || 'Specialized in scalable frontend & backend architectures';
  const specialization = user.company?.bs || title;

  return {
    id: `cand-api-${user.id}`,
    apiId: user.id,
    fullName: user.name,
    username: user.username || (user.name || '').toLowerCase().replace(/\s+/g, ''),
    email: (user.email || '').toLowerCase(),
    phone: user.phone || '+91 98765 43210',
    title: `${title} • ${specialization.split(' ')[0]}`,
    roleTitle: title,
    specialization: specialization,
    headline: headline,
    companyName: companyName,
    bio: `${user.name} is a seasoned ${title} at ${companyName}. ${headline}. Passionate about clean architecture, high availability, and agile team delivery.`,
    location: fullAddress,
    city: city,
    street: street,
    zipcode: user.address?.zipcode || '',
    avatar: avatar,
    skills: skills,
    experienceLevel: experienceLevel,
    availability: availability,
    yearsOfExperience: 3 + (index % 7),
    education: 'Bachelor of Technology in Computer Science',
    institution: 'National Institute of Technology',
    gradYear: 2018 + (index % 5),
    rating: (4.6 + (index % 5) * 0.1).toFixed(1),
    completedProjects: 12 + (index * 3),
    verified: true,
    website: `https://${(user.website || 'portfolio.dev').toLowerCase()}`,
    github: `https://github.com/${(user.username || (user.name || '').split(' ')[0]).toLowerCase()}`,
    linkedin: `https://linkedin.com/in/${(user.username || (user.name || '').split(' ')[0]).toLowerCase()}`,
  };
};

// Strict deduplication for candidate items
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

// Safe storage access
export const getStoredCandidates = () => {
  try {
    const raw = localStorage.getItem(CANDIDATES_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? deduplicateCandidates(parsed) : [];
  } catch (e) {
    console.error('Error reading candidates from storage:', e);
    return [];
  }
};

export const setStoredCandidates = (candidates) => {
  try {
    const clean = deduplicateCandidates(candidates);
    localStorage.setItem(CANDIDATES_STORAGE_KEY, JSON.stringify(clean));
  } catch (e) {
    console.error('Error saving candidates to storage:', e);
  }
};

export const candidateService = {
  // 1. Fetch Candidates directly from User API (/users)
  getCandidates: async (forceRefresh = false) => {
    try {
      const response = await api.get('/users', { bypassCache: forceRefresh });
      const apiUsers = response.data || [];

      // Transform API users to full Candidate model
      const apiCandidates = apiUsers.map((user, idx) => mapApiUserToCandidate(user, idx));

      // Overlay user additions / modified candidate profiles
      const stored = getStoredCandidates();
      const userAdded = stored.filter((c) => !apiCandidates.some((ac) => String(ac.id) === String(c.id)));
      const userModMap = new Map();
      stored.forEach((c) => userModMap.set(String(c.id), c));

      const merged = apiCandidates.map((ac) => {
        const storedMod = userModMap.get(String(ac.id));
        if (!storedMod) return ac;
        return {
          ...ac,
          ...storedMod,
          fullName: storedMod.fullName || ac.fullName,
          email: storedMod.email || ac.email,
          phone: storedMod.phone || ac.phone,
          location: storedMod.location || ac.location,
          city: storedMod.city || ac.city,
          companyName: storedMod.companyName || ac.companyName,
          headline: storedMod.headline || ac.headline,
          website: storedMod.website || ac.website,
          skills: Array.isArray(storedMod.skills) && storedMod.skills.length > 0 ? storedMod.skills : ac.skills,
          avatar: storedMod.avatar || ac.avatar,
        };
      });

      const combined = deduplicateCandidates([...userAdded, ...merged]);
      setStoredCandidates(combined);
      return combined;
    } catch (error) {
      console.warn('API fetch candidates fallback to cache:', error);
      return getStoredCandidates();
    }
  },

  // 2. Get Candidate by ID from User API (/users/:id)
  getCandidateById: async (id) => {
    const candidates = await candidateService.getCandidates();
    const found = candidates.find((c) => String(c.id) === String(id));
    if (found) return found;

    // Direct User API query fallback
    const numericId = String(id).replace(/[^\d]/g, '');
    if (numericId) {
      try {
        const res = await api.get(`/users/${numericId}`);
        if (res.data) {
          return mapApiUserToCandidate(res.data, parseInt(numericId, 10));
        }
      } catch (e) {
        console.warn('Direct user API candidate fetch fallback:', e);
      }
    }

    throw new Error(`Candidate with ID "${id}" was not found.`);
  },

  // 3. Add Candidate via User API POST (/users)
  addCandidate: async (candidateData) => {
    let apiResponse = null;
    try {
      apiResponse = await api.post('/users', {
        name: candidateData.fullName,
        email: candidateData.email,
        phone: candidateData.phone,
        website: candidateData.website,
        address: {
          city: candidateData.city || 'Bengaluru',
          street: candidateData.street || '',
        },
        company: {
          name: candidateData.companyName || 'Independent Talent',
          catchPhrase: candidateData.headline || candidateData.bio,
          bs: candidateData.roleTitle || 'Software Engineer',
        },
      });
    } catch (e) {
      console.warn('User API POST candidate simulated locally:', e);
    }

    const currentCandidates = getStoredCandidates();
    const newId = `cand-${Date.now()}`;

    let parsedSkills = candidateData.skills;
    if (typeof parsedSkills === 'string') {
      parsedSkills = parsedSkills.split(',').map((s) => s.trim()).filter(Boolean);
    } else if (!Array.isArray(parsedSkills)) {
      parsedSkills = ['React', 'JavaScript', 'Node.js'];
    }

    const newCandidate = {
      id: newId,
      apiId: apiResponse?.data?.id || Math.floor(Math.random() * 1000) + 101,
      fullName: candidateData.fullName.trim(),
      username: (candidateData.fullName || '').toLowerCase().replace(/\s+/g, ''),
      email: candidateData.email.trim().toLowerCase(),
      phone: candidateData.phone?.trim() || '+91 98765 43210',
      title: candidateData.roleTitle?.trim() || 'Senior Software Engineer',
      roleTitle: candidateData.roleTitle?.trim() || 'Senior Software Engineer',
      specialization: candidateData.roleTitle?.trim() || 'Software Engineer',
      headline: candidateData.headline?.trim() || `${candidateData.fullName} is an experienced technical professional.`,
      companyName: candidateData.companyName?.trim() || 'Independent Talent',
      bio: candidateData.bio?.trim() || `${candidateData.fullName} is an engineering candidate specializing in ${parsedSkills.slice(0, 3).join(', ')}.`,
      location: candidateData.location?.trim() || `${candidateData.city || 'Bengaluru'}, India`,
      city: candidateData.city?.trim() || 'Bengaluru',
      avatar: candidateData.avatar || AVATAR_PRESETS[Math.floor(Math.random() * AVATAR_PRESETS.length)],
      skills: parsedSkills.length > 0 ? parsedSkills : ['React', 'JavaScript', 'TypeScript'],
      experienceLevel: candidateData.experienceLevel || 'Senior Level (5+ yrs)',
      availability: candidateData.availability || 'Immediate Joiner',
      yearsOfExperience: parseInt(candidateData.yearsOfExperience, 10) || 4,
      education: candidateData.education?.trim() || 'Bachelor of Technology in Computer Science',
      institution: candidateData.institution?.trim() || 'National Institute of Technology',
      rating: '4.8',
      completedProjects: 14,
      verified: true,
      website: candidateData.website?.trim() || 'https://portfolio.dev',
      github: `https://github.com/${(candidateData.fullName || '').split(' ')[0].toLowerCase()}`,
      linkedin: `https://linkedin.com/in/${(candidateData.fullName || '').split(' ')[0].toLowerCase()}`,
      createdAt: new Date().toISOString(),
    };

    const updated = [newCandidate, ...currentCandidates];
    setStoredCandidates(updated);

    logCandidateActivity({
      id: `act-${Date.now()}`,
      type: 'candidate',
      title: 'New Candidate Profile Added',
      description: `${newCandidate.fullName} (${newCandidate.roleTitle}) joined the verified talent roster.`,
      timestamp: 'Just now',
      badge: 'New Talent',
      badgeColor: 'purple',
      iconName: 'Users',
    });

    return newCandidate;
  },

  // 4. Update Candidate via User API PUT (/users/:id)
  updateCandidate: async (id, candidateData) => {
    const numericId = String(id).replace(/[^\d]/g, '');
    try {
      if (numericId) {
        await api.put(`/users/${numericId}`, {
          name: candidateData.fullName,
          email: candidateData.email,
          phone: candidateData.phone,
          website: candidateData.website,
        });
      }
    } catch (e) {
      console.warn('User API PUT candidate simulated locally:', e);
    }

    const currentCandidates = getStoredCandidates();
    const index = currentCandidates.findIndex((c) => String(c.id) === String(id));

    if (index === -1) {
      throw new Error(`Candidate not found with ID: ${id}`);
    }

    const existing = currentCandidates[index];
    let parsedSkills = candidateData.skills !== undefined ? candidateData.skills : existing.skills;
    if (typeof parsedSkills === 'string') {
      parsedSkills = parsedSkills.split(',').map((s) => s.trim()).filter(Boolean);
    }

    const updatedCandidate = {
      ...existing,
      fullName: candidateData.fullName !== undefined ? candidateData.fullName.trim() : existing.fullName,
      email: candidateData.email !== undefined ? candidateData.email.trim().toLowerCase() : existing.email,
      phone: candidateData.phone !== undefined ? candidateData.phone.trim() : existing.phone,
      title: candidateData.roleTitle !== undefined ? candidateData.roleTitle.trim() : existing.title,
      roleTitle: candidateData.roleTitle !== undefined ? candidateData.roleTitle.trim() : existing.roleTitle,
      companyName: candidateData.companyName !== undefined ? candidateData.companyName.trim() : existing.companyName,
      headline: candidateData.headline !== undefined ? candidateData.headline.trim() : existing.headline,
      bio: candidateData.bio !== undefined ? candidateData.bio.trim() : existing.bio,
      location: candidateData.location !== undefined ? candidateData.location.trim() : existing.location,
      city: candidateData.city !== undefined ? candidateData.city.trim() : existing.city,
      skills: parsedSkills,
      experienceLevel: candidateData.experienceLevel || existing.experienceLevel,
      availability: candidateData.availability || existing.availability,
      yearsOfExperience: candidateData.yearsOfExperience !== undefined ? parseInt(candidateData.yearsOfExperience, 10) : existing.yearsOfExperience,
      website: candidateData.website !== undefined ? candidateData.website.trim() : existing.website,
      updatedAt: new Date().toISOString(),
    };

    currentCandidates[index] = updatedCandidate;
    setStoredCandidates(currentCandidates);

    logCandidateActivity({
      id: `act-${Date.now()}`,
      type: 'candidate',
      title: 'Candidate Profile Updated',
      description: `Candidate profile for ${updatedCandidate.fullName} was updated.`,
      timestamp: 'Just now',
      badge: 'Profile Edit',
      badgeColor: 'emerald',
      iconName: 'Users',
    });

    return updatedCandidate;
  },

  // 5. Delete Candidate via User API DELETE (/users/:id)
  deleteCandidate: async (id) => {
    const numericId = String(id).replace(/[^\d]/g, '');
    try {
      if (numericId) {
        await api.delete(`/users/${numericId}`);
      }
    } catch (e) {
      console.warn('User API DELETE candidate simulated locally:', e);
    }

    const currentCandidates = getStoredCandidates();
    const target = currentCandidates.find((c) => String(c.id) === String(id));
    const filtered = currentCandidates.filter((c) => String(c.id) !== String(id));

    setStoredCandidates(filtered);

    if (target) {
      logCandidateActivity({
        id: `act-${Date.now()}`,
        type: 'candidate',
        title: 'Candidate Removed',
        description: `${target.fullName} was removed from the candidate roster.`,
        timestamp: 'Just now',
        badge: 'Removed',
        badgeColor: 'rose',
        iconName: 'Users',
      });
    }

    return true;
  },
};

export default candidateService;
