import { User } from '../types';
import { storageService } from './storageService';

const DEMO_USERS: Record<string, User> = {
  admin: {
    id: 'user-admin-01',
    email: 'admin@bmw-experience.com',
    name: 'BMW Regional Administrator',
    role: 'admin',
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  user: {
    id: 'user-client-01',
    email: 'client@bmw-experience.com',
    name: 'Marcus Vance',
    role: 'user',
    createdAt: '2026-03-12T00:00:00.000Z'
  }
};

type AuthListener = (user: User | null) => void;
const listeners: Set<AuthListener> = new Set();

function notifyListeners(user: User | null) {
  listeners.forEach((listener) => listener(user));
}

export const authService = {
  getCurrentUser(): User | null {
    return storageService.getCurrentUser();
  },

  subscribe(listener: AuthListener): () => void {
    listeners.add(listener);
    listener(this.getCurrentUser());
    return () => {
      listeners.delete(listener);
    };
  },

  login(email: string, _password: string): { success: boolean; user?: User; error?: string } {
    if (!email || !email.includes('@')) {
      return { success: false, error: 'Please enter a valid email address.' };
    }

    const normalized = email.toLowerCase().trim();
    let user: User;

    if (normalized.includes('admin')) {
      user = DEMO_USERS.admin;
    } else {
      user = {
        id: `user-${Date.now()}`,
        email: normalized,
        name: normalized.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
        role: 'user',
        createdAt: new Date().toISOString()
      };
    }

    storageService.setCurrentUser(user);
    storageService.addAuditLog('USER_LOGIN', 'User', user.id, { email: user.email, role: user.role }, user.email);
    notifyListeners(user);
    return { success: true, user };
  },

  register(name: string, email: string, _password: string): { success: boolean; user?: User; error?: string } {
    if (!name.trim()) {
      return { success: false, error: 'Name is required.' };
    }
    if (!email || !email.includes('@')) {
      return { success: false, error: 'Please enter a valid email address.' };
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      email: email.toLowerCase().trim(),
      name: name.trim(),
      role: 'user',
      createdAt: new Date().toISOString()
    };

    storageService.setCurrentUser(newUser);
    storageService.addAuditLog('USER_REGISTER', 'User', newUser.id, { email: newUser.email }, newUser.email);
    notifyListeners(newUser);
    return { success: true, user: newUser };
  },

  logout(): void {
    const user = this.getCurrentUser();
    if (user) {
      storageService.addAuditLog('USER_LOGOUT', 'User', user.id, {}, user.email);
    }
    storageService.setCurrentUser(null);
    notifyListeners(null);
  },

  quickDemoLogin(role: 'admin' | 'user'): User {
    const demo = DEMO_USERS[role];
    storageService.setCurrentUser(demo);
    storageService.addAuditLog('DEMO_AUTH_SWITCH', 'User', demo.id, { role }, demo.email);
    notifyListeners(demo);
    return demo;
  },

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'admin';
  }
};
