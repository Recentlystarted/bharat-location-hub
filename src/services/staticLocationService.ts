// Static JSON API Service - No Database Required!
export class StaticLocationService {
  static baseUrl = window.location.origin + window.location.pathname.replace(/\/$/, '');

  // Get all states
  static async getStates() {
    try {
      const response = await fetch(`${this.baseUrl}/api/states.json`);
      const data = await response.json();
      return {
        success: true,
        data: data.states
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch states'
      };
    }
  }

  // Get districts by state name
  static async getStateDetails(stateName: string) {
    try {
      const filename = stateName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      const response = await fetch(`${this.baseUrl}/api/states/${filename}.json`);
      const data = await response.json();
      return {
        success: true,
        data
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch state details'
      };
    }
  }

  // Search locations by query
  static async searchLocations(query: string, limit: number = 50) {
    try {
      const searchTerm = query.toLowerCase();
      const firstLetter = searchTerm.charAt(0);
      
      if (!firstLetter.match(/[a-z]/)) {
        return {
          success: true,
          data: []
        };
      }

      const response = await fetch(`${this.baseUrl}/api/search/${firstLetter}.json`);
      const data = await response.json();
      
      // Filter results based on search term
      const filteredResults = data.locations
        .filter((location: any) => 
          location.searchText.includes(searchTerm) ||
          location.villageName.toLowerCase().includes(searchTerm) ||
          location.uniqueCode.toLowerCase().includes(searchTerm)
        )
        .slice(0, limit);

      return {
        success: true,
        data: filteredResults
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to search locations'
      };
    }
  }

  // Get database statistics
  static async getStats() {
    try {
      const response = await fetch(`${this.baseUrl}/api/stats.json`);
      const data = await response.json();
      return {
        success: true,
        data
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch statistics'
      };
    }
  }

  // Get API information
  static async getApiInfo() {
    try {
      const response = await fetch(`${this.baseUrl}/api/index.json`);
      const data = await response.json();
      return {
        success: true,
        data
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch API info'
      };
    }
  }
}

// Simple Authentication Service (Environment Variables)
export class SimpleAuthService {
  private static readonly ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'admin@bharat-location-hub.com';
  private static readonly ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';
  private static readonly SESSION_KEY = 'bharat-hub-session';

  // Login with environment credentials
  static login(email: string, password: string): { success: boolean; error?: string } {
    if (email === this.ADMIN_EMAIL && password === this.ADMIN_PASSWORD) {
      const session = {
        email,
        loginTime: new Date().toISOString(),
        isAuthenticated: true
      };
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
      return { success: true };
    }
    
    return { 
      success: false, 
      error: 'Invalid email or password' 
    };
  }

  // Check if user is logged in
  static isAuthenticated(): boolean {
    try {
      const session = localStorage.getItem(this.SESSION_KEY);
      if (!session) return false;
      
      const sessionData = JSON.parse(session);
      return sessionData.isAuthenticated === true;
    } catch {
      return false;
    }
  }

  // Get current user
  static getCurrentUser() {
    try {
      const session = localStorage.getItem(this.SESSION_KEY);
      if (!session) return null;
      
      return JSON.parse(session);
    } catch {
      return null;
    }
  }

  // Logout
  static logout() {
    localStorage.removeItem(this.SESSION_KEY);
  }
}
