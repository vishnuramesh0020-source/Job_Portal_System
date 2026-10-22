import { initialUsers } from '../data/seedUsers';

const USERS_STORAGE_KEY = 'job_portal_users';
const CURRENT_USER_STORAGE_KEY = 'job_portal_auth_user';

// Ensure seed users exist in localStorage on initial run
export const initializeAuthStorage = () => {
  const existingUsers = localStorage.getItem(USERS_STORAGE_KEY);
  if (!existingUsers) {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(initialUsers));
  }
};

// Retrieve all registered users from localStorage
export const getStoredUsers = () => {
  initializeAuthStorage();
  try {
    const data = localStorage.getItem(USERS_STORAGE_KEY);
    return data ? JSON.parse(data) : initialUsers;
  } catch (error) {
    console.error('Failed to parse users from localStorage:', error);
    return initialUsers;
  }
};

// Save updated users list to localStorage
export const saveStoredUsers = (users) => {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (error) {
    console.error('Failed to save users to localStorage:', error);
  }
};

// Retrieve current authenticated session user
export const getCurrentSession = () => {
  try {
    const session = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
    return session ? JSON.parse(session) : null;
  } catch (error) {
    console.error('Failed to read session:', error);
    return null;
  }
};

// Save current user session
export const saveCurrentSession = (user) => {
  try {
    localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(user));
  } catch (error) {
    console.error('Failed to save session:', error);
  }
};

// Clear session (Logout)
export const clearCurrentSession = () => {
  localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
};

// Authentication Methods
export const authService = {
  // Static Login
  login: async ({ email, password, role }) => {
    // Simulate network delay for realistic UX
    await new Promise((resolve) => setTimeout(resolve, 400));

    const users = getStoredUsers();
    const normalizedEmail = email.trim().toLowerCase();

    const user = users.find(
      (u) => u.email.toLowerCase() === normalizedEmail
    );

    if (!user) {
      throw new Error('No account found with this email address.');
    }

    if (user.password !== password) {
      throw new Error('Invalid password. Please double check and try again.');
    }

    if (role && user.role !== role) {
      throw new Error(
        `This account is registered as a ${user.role}, not a ${role}. Please choose the correct role.`
      );
    }

    // Prepare session object (omit plaintext password)
    const sessionUser = {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      phone: user.phone || '',
      companyName: user.companyName || '',
      companyWebsite: user.companyWebsite || '',
      title: user.title || '',
      location: user.location || '',
      bio: user.bio || '',
      token: `mock_jwt_token_${Date.now()}_${user.id}`,
      loginTimestamp: new Date().toISOString(),
    };

    saveCurrentSession(sessionUser);
    return sessionUser;
  },

  // Static Register
  register: async (userData) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const users = getStoredUsers();
    const normalizedEmail = userData.email.trim().toLowerCase();

    const existingUser = users.find(
      (u) => u.email.toLowerCase() === normalizedEmail
    );

    if (existingUser) {
      throw new Error('An account with this email address already exists.');
    }

    const newUser = {
      id: `user-${Date.now()}`,
      fullName: userData.fullName.trim(),
      email: normalizedEmail,
      password: userData.password,
      role: userData.role || 'candidate',
      phone: userData.phone?.trim() || '',
      companyName: userData.companyName?.trim() || '',
      companyWebsite: userData.companyWebsite?.trim() || '',
      title: userData.title?.trim() || '',
      location: userData.location?.trim() || '',
      bio: userData.bio?.trim() || '',
      createdAt: new Date().toISOString(),
    };

    const updatedUsers = [...users, newUser];
    saveStoredUsers(updatedUsers);

    // Create immediate session
    const sessionUser = {
      id: newUser.id,
      fullName: newUser.fullName,
      email: newUser.email,
      role: newUser.role,
      phone: newUser.phone,
      companyName: newUser.companyName,
      companyWebsite: newUser.companyWebsite,
      title: newUser.title,
      location: newUser.location,
      bio: newUser.bio,
      token: `mock_jwt_token_${Date.now()}_${newUser.id}`,
      loginTimestamp: new Date().toISOString(),
    };

    saveCurrentSession(sessionUser);
    return sessionUser;
  },

  // Reset Password for Forgot Password UI
  resetPassword: async ({ email, newPassword }) => {
    await new Promise((resolve) => setTimeout(resolve, 400));

    const users = getStoredUsers();
    const normalizedEmail = email.trim().toLowerCase();

    const userIndex = users.findIndex(
      (u) => u.email.toLowerCase() === normalizedEmail
    );

    if (userIndex === -1) {
      throw new Error('No registered account found with this email address.');
    }

    users[userIndex].password = newPassword;
    saveStoredUsers(users);

    return { success: true, message: 'Password has been reset successfully.' };
  },

  // Verify email exists for forgot password
  verifyEmail: async (email) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const users = getStoredUsers();
    const normalizedEmail = email.trim().toLowerCase();
    const user = users.find((u) => u.email.toLowerCase() === normalizedEmail);
    if (!user) {
      throw new Error('No account found associated with this email address.');
    }
    return { success: true, role: user.role, fullName: user.fullName };
  },

  // Logout
  logout: () => {
    clearCurrentSession();
  },
};
