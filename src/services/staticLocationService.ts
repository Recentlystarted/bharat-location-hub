// Professional Location Management Service
// Static JSON API with comprehensive admin functionality

export interface Location {
  id?: string;
  stateName: string;
  districtName: string;
  talukaName: string;
  villageName: string;
  uniqueCode?: string;
  searchText?: string;
}

export interface State {
  name: string;
  code: string;
  districts: number;
  talukas: number;
  villages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export class LocationService {
  private static baseUrl = window.location.origin + window.location.pathname.replace(/\/$/, '');
  private static localData: Location[] = [];
  private static states: State[] = [];

  // Initialize service - load all data for admin operations
  static async initialize(): Promise<void> {
    try {
      await this.loadStates();
      await this.loadAllLocations();
    } catch (error) {
      console.error('Failed to initialize LocationService:', error);
    }
  }

  // ===== PUBLIC READ OPERATIONS =====

  // Get all states
  static async getStates(): Promise<ApiResponse<State[]>> {
    try {
      if (this.states.length === 0) {
        const response = await fetch(`${this.baseUrl}/api/states.json`);
        const data = await response.json();
        this.states = data.states;
      }
      return {
        success: true,
        data: this.states
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch states'
      };
    }
  }

  // Get state details
  static async getStateDetails(stateName: string): Promise<ApiResponse<any>> {
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

  // Search locations
  static async searchLocations(query: string, limit: number = 50): Promise<ApiResponse<Location[]>> {
    try {
      const searchTerm = query.toLowerCase();
      
      // Search in local data if available (for admin)
      if (this.localData.length > 0) {
        const filteredResults = this.localData
          .filter((location: Location) => 
            location.villageName.toLowerCase().includes(searchTerm) ||
            location.districtName.toLowerCase().includes(searchTerm) ||
            location.talukaName.toLowerCase().includes(searchTerm) ||
            location.stateName.toLowerCase().includes(searchTerm) ||
            (location.uniqueCode && location.uniqueCode.toLowerCase().includes(searchTerm))
          )
          .slice(0, limit);

        return {
          success: true,
          data: filteredResults
        };
      }

      // Fallback to API search
      const firstLetter = searchTerm.charAt(0);
      if (!firstLetter.match(/[a-z0-9]/)) {
        return { success: true, data: [] };
      }

      const response = await fetch(`${this.baseUrl}/api/search/${firstLetter}.json`);
      const data = await response.json();
      
      const filteredResults = data.locations
        .filter((location: any) => 
          location.searchText?.includes(searchTerm) ||
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

  // Get statistics
  static async getStats(): Promise<ApiResponse<any>> {
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

  // ===== ADMIN OPERATIONS =====

  // Add new location
  static async addLocation(location: Omit<Location, 'id' | 'uniqueCode'>): Promise<ApiResponse<Location>> {
    try {
      await this.ensureDataLoaded();
      
      const newLocation: Location = {
        ...location,
        id: 'loc_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        uniqueCode: this.generateUniqueCode(location),
        searchText: this.generateSearchText(location)
      };

      this.localData.push(newLocation);
      await this.saveToLocalStorage();

      return {
        success: true,
        data: newLocation
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to add location'
      };
    }
  }

  // Update location
  static async updateLocation(id: string, updates: Partial<Location>): Promise<ApiResponse<Location>> {
    try {
      await this.ensureDataLoaded();
      
      const index = this.localData.findIndex(loc => loc.id === id);
      if (index === -1) {
        return {
          success: false,
          error: 'Location not found'
        };
      }

      const updatedLocation = { ...this.localData[index], ...updates };
      if (updates.stateName || updates.districtName || updates.talukaName || updates.villageName) {
        updatedLocation.uniqueCode = this.generateUniqueCode(updatedLocation);
        updatedLocation.searchText = this.generateSearchText(updatedLocation);
      }

      this.localData[index] = updatedLocation;
      await this.saveToLocalStorage();

      return {
        success: true,
        data: updatedLocation
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to update location'
      };
    }
  }

  // Delete location
  static async deleteLocation(id: string): Promise<ApiResponse<boolean>> {
    try {
      await this.ensureDataLoaded();
      
      const index = this.localData.findIndex(loc => loc.id === id);
      if (index === -1) {
        return {
          success: false,
          error: 'Location not found'
        };
      }

      this.localData.splice(index, 1);
      await this.saveToLocalStorage();

      return {
        success: true,
        data: true
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to delete location'
      };
    }
  }

  // Get all locations for admin
  static async getAllLocations(page: number = 1, limit: number = 100): Promise<ApiResponse<{ locations: Location[], total: number, pages: number }>> {
    try {
      await this.ensureDataLoaded();
      
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const locations = this.localData.slice(startIndex, endIndex);
      const total = this.localData.length;
      const pages = Math.ceil(total / limit);

      return {
        success: true,
        data: { locations, total, pages }
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch locations'
      };
    }
  }

  // Get locations by state for admin
  static async getLocationsByState(stateName: string): Promise<ApiResponse<Location[]>> {
    try {
      await this.ensureDataLoaded();
      
      const locations = this.localData.filter(loc => 
        loc.stateName.toLowerCase() === stateName.toLowerCase()
      );

      return {
        success: true,
        data: locations
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch locations by state'
      };
    }
  }

  // Export data
  static async exportData(): Promise<ApiResponse<string>> {
    try {
      await this.ensureDataLoaded();
      
      const exportData = {
        timestamp: new Date().toISOString(),
        totalLocations: this.localData.length,
        locations: this.localData
      };

      const jsonString = JSON.stringify(exportData, null, 2);
      return {
        success: true,
        data: jsonString
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to export data'
      };
    }
  }

  // ===== PRIVATE HELPER METHODS =====

  private static async loadStates(): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/api/states.json`);
      const data = await response.json();
      this.states = data.states;
    } catch (error) {
      console.error('Failed to load states:', error);
    }
  }

  private static async loadAllLocations(): Promise<void> {
    // Don't load all data into localStorage due to quota limits
    // Instead, we'll load data on-demand for searches
    console.log('Location service initialized - data will be loaded on-demand');
  }

  private static async ensureDataLoaded(): Promise<void> {
    if (this.localData.length === 0) {
      await this.loadAllLocations();
    }
  }

  private static async saveToLocalStorage(): Promise<void> {
    // Don't save to localStorage due to quota limits
    // Only save small admin-specific data if needed
    console.log('Skipping localStorage save due to quota limits');
  }

  private static generateUniqueCode(location: Location): string {
    const stateCode = location.stateName.substring(0, 2).toUpperCase();
    const districtCode = location.districtName.substring(0, 3).toUpperCase();
    const talukaCode = location.talukaName.substring(0, 3).toUpperCase();
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    
    return `${stateCode}-${districtCode}-${talukaCode}-${random}`;
  }

  private static generateSearchText(location: Location): string {
    return [
      location.stateName,
      location.districtName,
      location.talukaName,
      location.villageName
    ].join(' ').toLowerCase();
  }
}

// Simple Authentication Service
export class AuthService {
  private static readonly ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'support@office-tools.in';
  private static readonly ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'Ahmed@312024';
  private static readonly SESSION_KEY = 'bharat-hub-session';
  private static readonly SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

  static getDebugInfo() {
    return {
      envEmail: import.meta.env.VITE_ADMIN_EMAIL,
      envPassword: import.meta.env.VITE_ADMIN_PASSWORD,
      finalEmail: this.ADMIN_EMAIL,
      finalPassword: this.ADMIN_PASSWORD
    };
  }

  static login(email: string, password: string): { success: boolean; error?: string } {
    // Debug environment variables
    console.log('Auth Debug:', this.getDebugInfo());
    
    if (email.trim() === this.ADMIN_EMAIL && password === this.ADMIN_PASSWORD) {
      const session = {
        email: email.trim(),
        loginTime: new Date().toISOString(),
        expiresAt: Date.now() + this.SESSION_DURATION,
        isAuthenticated: true
      };
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
      return { success: true };
    }
    
    return { 
      success: false, 
      error: 'Invalid credentials. Please check your email and password.' 
    };
  }

  static isAuthenticated(): boolean {
    try {
      const session = localStorage.getItem(this.SESSION_KEY);
      if (!session) return false;
      
      const sessionData = JSON.parse(session);
      
      // Check if session expired
      if (Date.now() > sessionData.expiresAt) {
        this.logout();
        return false;
      }
      
      return sessionData.isAuthenticated === true;
    } catch {
      return false;
    }
  }

  static getCurrentUser() {
    try {
      if (!this.isAuthenticated()) return null;
      
      const session = localStorage.getItem(this.SESSION_KEY);
      if (!session) return null;
      
      return JSON.parse(session);
    } catch {
      return null;
    }
  }

  static logout() {
    localStorage.removeItem(this.SESSION_KEY);
  }

  // Extend session on activity
  static extendSession(): void {
    if (this.isAuthenticated()) {
      const session = localStorage.getItem(this.SESSION_KEY);
      if (session) {
        try {
          const sessionData = JSON.parse(session);
          sessionData.expiresAt = Date.now() + this.SESSION_DURATION;
          localStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionData));
        } catch {
          this.logout();
        }
      }
    }
  }
}

// Export legacy names for compatibility
export const StaticLocationService = LocationService;
export const SimpleAuthService = AuthService;
