// Professional Authentication Service
// Environment-based authentication with persistent sessions

export interface AdminUser {
  uid: string;
  email: string;
  role: 'admin' | 'super_admin';
  name: string;
  createdAt: string;
  lastLogin: string;
  permissions: string[];
}

export interface AuthResponse {
  success: boolean;
  user?: AdminUser;
  error?: string;
}

export class AuthService {
  private static readonly STORAGE_KEY = 'bharat-hub-auth';
  private static readonly SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

  // Get admin credentials from environment
  private static getAdminCredentials() {
    return {
      email: import.meta.env.VITE_ADMIN_EMAIL || 'support@office-toools.in',
      password: import.meta.env.VITE_ADMIN_PASSWORD || 'Ahmed@312024'
    };
  }

  /**
   * Sign in admin user
   */
  static async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
      const credentials = this.getAdminCredentials();
      
      if (email === credentials.email && password === credentials.password) {
        const adminUser: AdminUser = {
          uid: 'admin-' + Date.now(),
          email,
          role: 'super_admin',
          name: 'Administrator',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          permissions: this.getDefaultPermissions('super_admin')
        };

        // Store session with expiration
        const authData = {
          user: adminUser,
          expiresAt: Date.now() + this.SESSION_DURATION
        };
        
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(authData));

        return {
          success: true,
          user: adminUser
        };
      } else {
        return {
          success: false,
          error: 'Invalid email or password'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to sign in'
      };
    }
  }

  /**
   * Create admin user (for future use)
   */
  static async createAdminUser(
    email: string, 
    password: string, 
    name: string, 
    role: 'admin' | 'super_admin' = 'admin'
  ): Promise<AuthResponse> {
    // For now, this returns an error as we're using single admin
    return {
      success: false,
      error: 'Admin creation not available in current setup'
    };
  }

  /**
   * Sign out
   */
  static async signOut(): Promise<void> {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  /**
   * Get current admin user
   */
  static async getCurrentUser(): Promise<AdminUser | null> {
    try {
      const authData = localStorage.getItem(this.STORAGE_KEY);
      if (!authData) return null;
      
      const { user, expiresAt } = JSON.parse(authData);
      
      // Check if session expired
      if (Date.now() > expiresAt) {
        await this.signOut();
        return null;
      }
      
      return user;
    } catch {
      return null;
    }
  }

  /**
   * Reset password (placeholder)
   */
  static async resetPassword(email: string): Promise<{ success: boolean; error?: string }> {
    return {
      success: false,
      error: 'Password reset not available. Contact system administrator.'
    };
  }

  /**
   * Listen to auth state changes
   */
  static onAuthStateChanged(callback: (user: AdminUser | null) => void): () => void {
    // Check current auth state
    this.getCurrentUser().then(callback);
    
    // Set up periodic check for session expiry
    const interval = setInterval(async () => {
      const user = await this.getCurrentUser();
      callback(user);
    }, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }

  /**
   * Check if user has permission
   */
  static hasPermission(user: AdminUser | null, permission: string): boolean {
    if (!user) return false;
    if (user.role === 'super_admin') return true;
    return user.permissions.includes(permission);
  }

  /**
   * Check if user is authenticated
   */
  static async isAuthenticated(): Promise<boolean> {
    const user = await this.getCurrentUser();
    return user !== null;
  }

  /**
   * Extend session on user activity
   */
  static extendSession(): void {
    const authData = localStorage.getItem(this.STORAGE_KEY);
    if (authData) {
      try {
        const data = JSON.parse(authData);
        data.expiresAt = Date.now() + this.SESSION_DURATION;
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
      } catch {
        // If error, clear storage
        this.signOut();
      }
    }
  }

  // Private methods
  private static getDefaultPermissions(role: 'admin' | 'super_admin'): string[] {
    const basePermissions = [
      'locations.read',
      'locations.create',
      'locations.update'
    ];

    if (role === 'super_admin') {
      return [
        ...basePermissions,
        'locations.delete',
        'admin.create',
        'admin.manage',
        'system.manage'
      ];
    }

    return basePermissions;
  }
}

// Permissions constants
export const PERMISSIONS = {
  LOCATIONS_READ: 'locations.read',
  LOCATIONS_CREATE: 'locations.create',
  LOCATIONS_UPDATE: 'locations.update',
  LOCATIONS_DELETE: 'locations.delete',
  ADMIN_CREATE: 'admin.create',
  ADMIN_MANAGE: 'admin.manage',
  SYSTEM_MANAGE: 'system.manage'
} as const;
