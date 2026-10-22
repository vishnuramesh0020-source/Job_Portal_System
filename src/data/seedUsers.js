// Pre-seeded demo users for testing the static authentication module
export const initialUsers = [
  {
    id: 'user-cand-1',
    fullName: 'Alex Johnson',
    email: 'candidate@jobportal.com',
    password: 'Password123',
    role: 'candidate',
    phone: '+1 (555) 234-5678',
    title: 'Senior Frontend Developer',
    location: 'San Francisco, CA',
    bio: 'Passionate frontend engineer with 5+ years of experience in React, TypeScript, and modern web architectures.',
    createdAt: '2026-01-15T08:00:00.000Z'
  },
  {
    id: 'user-rec-1',
    fullName: 'Sarah Miller',
    email: 'recruiter@jobportal.com',
    password: 'Password123',
    role: 'recruiter',
    phone: '+1 (555) 876-5432',
    companyName: 'TechCorp Solutions',
    companyWebsite: 'https://techcorp.example.com',
    location: 'New York, NY',
    bio: 'Senior Technical Talent Acquisition Partner hiring top engineering talent.',
    createdAt: '2026-01-10T10:30:00.000Z'
  }
];
