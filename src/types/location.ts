export interface IndiaLocationData {
  states: State[];
}

export interface State {
  code: string;
  name: string;
  districts: District[];
}

export interface District {
  code: string;
  name: string;
  talukas: Taluka[];
}

export interface Taluka {
  code: string;
  name: string;
  villages: Village[];
}

export interface Village {
  code: string;
  name: string;
}

// For Firebase storage
export interface LocationDocument {
  id: string;
  stateName: string;
  stateCode: string;
  districtName: string;
  districtCode: string;
  talukaName: string;
  talukaCode: string;
  villageName: string;
  villageCode: string;
  uniqueCode: string;
  fullPath: string; // e.g., "ANDAMAN & NICOBAR ISLANDS > Nicobars > Car Nicobar > Arong"
  searchText: string; // Combined text for search
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface LocationQuery {
  state?: string;
  district?: string;
  taluka?: string;
  village?: string;
  code?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface LocationStats {
  totalStates: number;
  totalDistricts: number;
  totalTalukas: number;
  totalVillages: number;
}
