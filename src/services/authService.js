import { storageService } from './storageService';
import { DEMO_USER } from '../data/mockData';

const USERS_KEY = 'apex_users';
const CURRENT_USER_KEY = 'apex_current_user';

export const authService = {
  init() {
    const existingUsers = storageService.get(USERS_KEY, []);
    const demoExists = existingUsers.some(u => u.email.toLowerCase() === DEMO_USER.email.toLowerCase());
    
    if (!demoExists) {
      const demoAccount = {
        ...DEMO_USER,
        password: 'Demo@123',
        createdAt: new Date().toISOString()
      };
      existingUsers.push(demoAccount);
      storageService.set(USERS_KEY, existingUsers);
    }

    // Default current user to demo user for a polished immediate experience,
    // or respect existing session
    const currentSession = storageService.get(CURRENT_USER_KEY, null);
    if (!currentSession) {
      storageService.set(CURRENT_USER_KEY, DEMO_USER);
    }
  },

  getCurrentUser() {
    return storageService.get(CURRENT_USER_KEY, null);
  },

  getInitials(name) {
    if (!name) return 'AP';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  },

  login(identifier, password) {
    const users = storageService.get(USERS_KEY, []);
    const user = users.find(u => 
      (u.email.toLowerCase() === identifier.trim().toLowerCase() || u.phone === identifier.trim())
    );

    if (!user) {
      throw new Error('No account found with this email or phone.');
    }

    if (user.password !== password) {
      throw new Error('Incorrect password. Please try again.');
    }

    const { password: _, ...safeUser } = user;
    storageService.set(CURRENT_USER_KEY, safeUser);
    return safeUser;
  },

  register({ name, email, phone, password }) {
    const users = storageService.get(USERS_KEY, []);
    const emailLower = email.trim().toLowerCase();
    
    if (users.some(u => u.email.toLowerCase() === emailLower)) {
      throw new Error('An account with this email already exists.');
    }

    const initials = this.getInitials(name);
    const randomId = 'APEX-' + Math.floor(1000 + Math.random() * 9000);

    const newUser = {
      id: 'usr_' + Date.now(),
      name: name.trim(),
      initials,
      email: emailLower,
      phone: phone || '(877) 225-2046',
      address: '742 Evergreen Terr, Suite 4B',
      city: 'Springfield',
      zip: '62704',
      clientSince: new Date().getFullYear().toString(),
      clientId: randomId,
      password: password,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    storageService.set(USERS_KEY, users);

    const { password: _, ...safeUser } = newUser;
    storageService.set(CURRENT_USER_KEY, safeUser);
    return safeUser;
  },

  updateProfile(updates) {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return null;

    const updatedUser = {
      ...currentUser,
      ...updates,
      initials: updates.name ? this.getInitials(updates.name) : currentUser.initials
    };

    storageService.set(CURRENT_USER_KEY, updatedUser);

    // Update in users database as well
    const users = storageService.get(USERS_KEY, []);
    const index = users.findIndex(u => u.id === currentUser.id);
    if (index !== -1) {
      users[index] = { ...users[index], ...updates };
      storageService.set(USERS_KEY, users);
    }

    return updatedUser;
  },

  logout() {
    storageService.remove(CURRENT_USER_KEY);
  }
};

