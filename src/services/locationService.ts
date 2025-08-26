import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc,
  query, 
  where, 
  orderBy, 
  limit as firestoreLimit,
  writeBatch
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { LocationDocument, LocationQuery, ApiResponse, LocationStats } from '../types/location';
import { generateUniqueCode } from '../utils/codeGenerator';

const LOCATIONS_COLLECTION = 'locations';
const STATS_COLLECTION = 'stats';

export class LocationService {
  // Create a new location
  static async createLocation(locationData: Omit<LocationDocument, 'id' | 'uniqueCode' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<LocationDocument>> {
    try {
      const uniqueCode = generateUniqueCode(
        locationData.stateName, 
        locationData.districtName, 
        locationData.villageName
      );
      
      const newLocation: Omit<LocationDocument, 'id'> = {
        ...locationData,
        uniqueCode,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const docRef = await addDoc(collection(db, LOCATIONS_COLLECTION), newLocation);
      const createdLocation = { ...newLocation, id: docRef.id } as LocationDocument;

      return {
        success: true,
        data: createdLocation
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create location'
      };
    }
  }

  // Batch create locations (for data migration)
  static async batchCreateLocations(locations: Omit<LocationDocument, 'id' | 'uniqueCode' | 'createdAt' | 'updatedAt'>[]): Promise<ApiResponse<number>> {
    try {
      const batch = writeBatch(db);
      let count = 0;

      for (const locationData of locations) {
        const uniqueCode = generateUniqueCode(
          locationData.stateName, 
          locationData.districtName, 
          locationData.villageName
        );
        
        const newLocation: Omit<LocationDocument, 'id'> = {
          ...locationData,
          uniqueCode,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        const docRef = doc(collection(db, LOCATIONS_COLLECTION));
        batch.set(docRef, newLocation);
        count++;

        // Firestore batch limit is 500
        if (count % 500 === 0) {
          await batch.commit();
        }
      }

      // Commit remaining
      if (count % 500 !== 0) {
        await batch.commit();
      }

      return {
        success: true,
        data: count
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to batch create locations'
      };
    }
  }

  // Get locations with filtering and pagination
  static async getLocations(queryParams: LocationQuery = {}): Promise<ApiResponse<LocationDocument[]>> {
    try {
      const { 
        state, 
        district, 
        taluka, 
        village, 
        code,
        search, 
        page = 1, 
        limit = 50 
      } = queryParams;

      let locationQuery = query(collection(db, LOCATIONS_COLLECTION));

      // Apply filters
      if (state) {
        locationQuery = query(locationQuery, where('stateName', '==', state));
      }
      if (district) {
        locationQuery = query(locationQuery, where('districtName', '==', district));
      }
      if (taluka) {
        locationQuery = query(locationQuery, where('talukaName', '==', taluka));
      }
      if (village) {
        locationQuery = query(locationQuery, where('villageName', '==', village));
      }
      if (code) {
        locationQuery = query(locationQuery, where('villageCode', '==', code));
      }

      // Add ordering and pagination
      locationQuery = query(
        locationQuery, 
        orderBy('stateName'),
        orderBy('districtName'),
        firestoreLimit(limit)
      );

      const querySnapshot = await getDocs(locationQuery);
      const locations: LocationDocument[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        locations.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        } as LocationDocument);
      });

      // Filter by search term if provided
      let filteredLocations = locations;
      if (search) {
        const searchTerm = search.toLowerCase();
        filteredLocations = locations.filter(location =>
          location.searchText.toLowerCase().includes(searchTerm) ||
          location.stateName.toLowerCase().includes(searchTerm) ||
          location.districtName.toLowerCase().includes(searchTerm) ||
          location.talukaName.toLowerCase().includes(searchTerm) ||
          location.villageName.toLowerCase().includes(searchTerm) ||
          location.villageCode.includes(searchTerm)
        );
      }

      return {
        success: true,
        data: filteredLocations,
        pagination: {
          page,
          limit,
          total: filteredLocations.length,
          totalPages: Math.ceil(filteredLocations.length / limit)
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch locations'
      };
    }
  }

  // Get location by ID
  static async getLocationById(id: string): Promise<ApiResponse<LocationDocument>> {
    try {
      const docRef = doc(db, LOCATIONS_COLLECTION, id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return {
          success: false,
          error: 'Location not found'
        };
      }

      const data = docSnap.data();
      const location: LocationDocument = {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date()
      } as LocationDocument;

      return {
        success: true,
        data: location
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch location'
      };
    }
  }

  // Update location
  static async updateLocation(id: string, updates: Partial<LocationDocument>): Promise<ApiResponse<LocationDocument>> {
    try {
      const docRef = doc(db, LOCATIONS_COLLECTION, id);
      
      const updateData = {
        ...updates,
        updatedAt: new Date()
      };

      await updateDoc(docRef, updateData);
      
      // Fetch and return updated location
      const result = await this.getLocationById(id);
      return result;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update location'
      };
    }
  }

  // Delete location
  static async deleteLocation(id: string): Promise<ApiResponse<void>> {
    try {
      const docRef = doc(db, LOCATIONS_COLLECTION, id);
      await deleteDoc(docRef);

      return {
        success: true
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete location'
      };
    }
  }

  // Get unique states
  static async getStates(): Promise<ApiResponse<string[]>> {
    try {
      const querySnapshot = await getDocs(collection(db, LOCATIONS_COLLECTION));
      const states = new Set<string>();

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.stateName) {
          states.add(data.stateName);
        }
      });

      return {
        success: true,
        data: Array.from(states).sort()
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch states'
      };
    }
  }

  // Get districts by state
  static async getDistrictsByState(state: string): Promise<ApiResponse<string[]>> {
    try {
      const q = query(
        collection(db, LOCATIONS_COLLECTION),
        where('stateName', '==', state)
      );
      
      const querySnapshot = await getDocs(q);
      const districts = new Set<string>();

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.districtName) {
          districts.add(data.districtName);
        }
      });

      return {
        success: true,
        data: Array.from(districts).sort()
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch districts'
      };
    }
  }

  // Get talukas by district
  static async getTalukasByDistrict(state: string, district: string): Promise<ApiResponse<string[]>> {
    try {
      const q = query(
        collection(db, LOCATIONS_COLLECTION),
        where('stateName', '==', state),
        where('districtName', '==', district)
      );
      
      const querySnapshot = await getDocs(q);
      const talukas = new Set<string>();

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.talukaName) {
          talukas.add(data.talukaName);
        }
      });

      return {
        success: true,
        data: Array.from(talukas).sort()
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch talukas'
      };
    }
  }

  // Get villages by taluka
  static async getVillagesByTaluka(state: string, district: string, taluka: string): Promise<ApiResponse<string[]>> {
    try {
      const q = query(
        collection(db, LOCATIONS_COLLECTION),
        where('stateName', '==', state),
        where('districtName', '==', district),
        where('talukaName', '==', taluka)
      );
      
      const querySnapshot = await getDocs(q);
      const villages = new Set<string>();

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.villageName) {
          villages.add(data.villageName);
        }
      });

      return {
        success: true,
        data: Array.from(villages).sort()
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch villages'
      };
    }
  }

  // Get location statistics
  static async getLocationStats(): Promise<ApiResponse<LocationStats>> {
    try {
      const statsDoc = await getDoc(doc(db, STATS_COLLECTION, 'location_stats'));
      
      if (statsDoc.exists()) {
        return {
          success: true,
          data: statsDoc.data() as LocationStats
        };
      }

      // If stats don't exist, calculate them
      const querySnapshot = await getDocs(collection(db, LOCATIONS_COLLECTION));
      const states = new Set<string>();
      const districts = new Set<string>();
      const talukas = new Set<string>();
      let villages = 0;

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        states.add(data.stateName);
        districts.add(`${data.stateName}|${data.districtName}`);
        talukas.add(`${data.stateName}|${data.districtName}|${data.talukaName}`);
        villages++;
      });

      const stats: LocationStats = {
        totalStates: states.size,
        totalDistricts: districts.size,
        totalTalukas: talukas.size,
        totalVillages: villages
      };

      return {
        success: true,
        data: stats
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch location stats'
      };
    }
  }
}
