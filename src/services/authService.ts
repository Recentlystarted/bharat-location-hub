import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

export interface AdminUser {
  uid: string;
  email: string;
  role: 'admin' | 'super_admin';
  name: string;
  createdAt: Date;
  lastLogin: Date;
  permissions: string[];
}

export interface AuthResponse {
  success: boolean;
  user?: AdminUser;
  error?: string;
}

export class AuthService {
  /**
   * Sign in admin user
   */
  static async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check if user is admin
      const adminUser = await this.getAdminUser(user.uid);
      if (!adminUser) {
        await signOut(auth);
        return {
          success: false,
          error: 'Unauthorized access. Admin privileges required.'
        };
      }

      // Update last login
      await this.updateLastLogin(user.uid);

      return {
        success: true,
        user: adminUser
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to sign in'
      };
    }
  }

  /**
   * Create admin user (only for super admin)
   */
  static async createAdminUser(
    email: string, 
    password: string, 
    name: string, 
    role: 'admin' | 'super_admin' = 'admin'
  ): Promise<AuthResponse> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const adminUser: AdminUser = {
        uid: user.uid,
        email: user.email!,
        role,
        name,
        createdAt: new Date(),
        lastLogin: new Date(),
        permissions: this.getDefaultPermissions(role)
      };

      // Save admin user data
      await setDoc(doc(db, 'admins', user.uid), adminUser);

      return {
        success: true,
        user: adminUser
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create admin user'
      };
    }
  }

  /**
   * Sign out
   */
  static async signOut(): Promise<void> {
    await signOut(auth);
  }

  /**
   * Get current admin user
   */
  static async getCurrentUser(): Promise<AdminUser | null> {
    const user = auth.currentUser;
    if (!user) return null;

    return await this.getAdminUser(user.uid);
  }

  /**
   * Reset password
   */
  static async resetPassword(email: string): Promise<{ success: boolean; error?: string }> {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send reset email'
      };
    }
  }

  /**
   * Listen to auth state changes
   */
  static onAuthStateChanged(callback: (user: AdminUser | null) => void): () => void {
    return onAuthStateChanged(auth, async (user) => {
      if (user) {
        const adminUser = await this.getAdminUser(user.uid);
        callback(adminUser);
      } else {
        callback(null);
      }
    });
  }

  /**
   * Check if user has permission
   */
  static hasPermission(user: AdminUser | null, permission: string): boolean {
    if (!user) return false;
    if (user.role === 'super_admin') return true;
    return user.permissions.includes(permission);
  }

  // Private methods
  private static async getAdminUser(uid: string): Promise<AdminUser | null> {
    try {
      const adminDoc = await getDoc(doc(db, 'admins', uid));
      if (!adminDoc.exists()) return null;

      const data = adminDoc.data();
      return {
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        lastLogin: data.lastLogin?.toDate() || new Date()
      } as AdminUser;
    } catch (error) {
      console.error('Failed to get admin user:', error);
      return null;
    }
  }

  private static async updateLastLogin(uid: string): Promise<void> {
    try {
      await setDoc(
        doc(db, 'admins', uid),
        { lastLogin: new Date() },
        { merge: true }
      );
    } catch (error) {
      console.error('Failed to update last login:', error);
    }
  }

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
