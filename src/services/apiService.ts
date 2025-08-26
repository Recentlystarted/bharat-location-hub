import type { LocationDocument, LocationQuery, ApiResponse, LocationStats } from '../types/location';
import { LocationService } from './locationService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

/**
 * API Service for external applications to consume location data
 * This provides REST API endpoints that can be used by web and mobile apps
 */
export class ApiService {
  
  /**
   * GET /api/locations
   * Fetch locations with optional filtering and pagination
   */
  static async getLocations(params: LocationQuery = {}): Promise<ApiResponse<LocationDocument[]>> {
    try {
      // If we're in a Firebase environment, use the LocationService directly
      if (!API_BASE_URL) {
        return await LocationService.getLocations(params);
      }

      // Otherwise, make HTTP request to external API
      const queryString = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryString.append(key, value.toString());
        }
      });

      const response = await fetch(`${API_BASE_URL}/api/locations?${queryString}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch locations'
      };
    }
  }

  /**
   * GET /api/locations/:id
   * Fetch a specific location by ID
   */
  static async getLocationById(id: string): Promise<ApiResponse<LocationDocument>> {
    try {
      if (!API_BASE_URL) {
        return await LocationService.getLocationById(id);
      }

      const response = await fetch(`${API_BASE_URL}/api/locations/${id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch location'
      };
    }
  }

  /**
   * GET /api/states
   * Fetch all available states
   */
  static async getStates(): Promise<ApiResponse<string[]>> {
    try {
      if (!API_BASE_URL) {
        return await LocationService.getStates();
      }

      const response = await fetch(`${API_BASE_URL}/api/states`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch states'
      };
    }
  }

  /**
   * GET /api/states/:state/districts
   * Fetch districts for a specific state
   */
  static async getDistrictsByState(state: string): Promise<ApiResponse<string[]>> {
    try {
      if (!API_BASE_URL) {
        return await LocationService.getDistrictsByState(state);
      }

      const response = await fetch(`${API_BASE_URL}/api/states/${encodeURIComponent(state)}/districts`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch districts'
      };
    }
  }

  /**
   * GET /api/districts/:state/:district/talukas
   * Fetch talukas for a specific district
   */
  static async getTalukasByDistrict(state: string, district: string): Promise<ApiResponse<string[]>> {
    try {
      if (!API_BASE_URL) {
        return await LocationService.getTalukasByDistrict(state, district);
      }

      const response = await fetch(`${API_BASE_URL}/api/districts/${encodeURIComponent(state)}/${encodeURIComponent(district)}/talukas`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch talukas'
      };
    }
  }

  /**
   * GET /api/talukas/:state/:district/:taluka/villages
   * Fetch villages for a specific taluka
   */
  static async getVillagesByTaluka(state: string, district: string, taluka: string): Promise<ApiResponse<string[]>> {
    try {
      if (!API_BASE_URL) {
        return await LocationService.getVillagesByTaluka(state, district, taluka);
      }

      const response = await fetch(`${API_BASE_URL}/api/talukas/${encodeURIComponent(state)}/${encodeURIComponent(district)}/${encodeURIComponent(taluka)}/villages`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch villages'
      };
    }
  }

  /**
   * GET /api/stats
   * Get location statistics
   */
  static async getLocationStats(): Promise<ApiResponse<LocationStats>> {
    try {
      if (!API_BASE_URL) {
        return await LocationService.getLocationStats();
      }

      const response = await fetch(`${API_BASE_URL}/api/stats`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch stats'
      };
    }
  }

  /**
   * POST /api/locations (Admin only)
   * Create a new location
   */
  static async createLocation(
    locationData: Omit<LocationDocument, 'id' | 'uniqueCode' | 'createdAt' | 'updatedAt'>,
    authToken?: string
  ): Promise<ApiResponse<LocationDocument>> {
    try {
      if (!API_BASE_URL) {
        return await LocationService.createLocation(locationData);
      }

      const response = await fetch(`${API_BASE_URL}/api/locations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken && { 'Authorization': `Bearer ${authToken}` })
        },
        body: JSON.stringify(locationData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create location'
      };
    }
  }

  /**
   * PUT /api/locations/:id (Admin only)
   * Update a location
   */
  static async updateLocation(
    id: string,
    updates: Partial<LocationDocument>,
    authToken?: string
  ): Promise<ApiResponse<LocationDocument>> {
    try {
      if (!API_BASE_URL) {
        return await LocationService.updateLocation(id, updates);
      }

      const response = await fetch(`${API_BASE_URL}/api/locations/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken && { 'Authorization': `Bearer ${authToken}` })
        },
        body: JSON.stringify(updates)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update location'
      };
    }
  }

  /**
   * DELETE /api/locations/:id (Admin only)
   * Delete a location
   */
  static async deleteLocation(id: string, authToken?: string): Promise<ApiResponse<void>> {
    try {
      if (!API_BASE_URL) {
        return await LocationService.deleteLocation(id);
      }

      const response = await fetch(`${API_BASE_URL}/api/locations/${id}`, {
        method: 'DELETE',
        headers: {
          ...(authToken && { 'Authorization': `Bearer ${authToken}` })
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete location'
      };
    }
  }

  /**
   * GET /api/search
   * Search locations by query
   */
  static async searchLocations(searchQuery: string, limit = 20): Promise<ApiResponse<LocationDocument[]>> {
    return this.getLocations({ search: searchQuery, limit });
  }

  /**
   * GET /api/locations/by-code/:code
   * Get locations by village code
   */
  static async getLocationsByCode(code: string): Promise<ApiResponse<LocationDocument[]>> {
    return this.getLocations({ code });
  }
}

// Export for easy integration in other projects
export default ApiService;
