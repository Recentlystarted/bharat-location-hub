/**
 * Simple UUID v4 generator without external dependencies
 */
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Generates a unique code for a location based on state, district, and village
 * Format: ST-DIS-VIL-XXXX (where XXXX is a 4-character unique identifier)
 */
export function generateUniqueCode(state: string, district: string, village?: string): string {
  // Create abbreviations
  const stateAbbr = state.substring(0, 2).toUpperCase();
  const districtAbbr = district.substring(0, 3).toUpperCase();
  const villageAbbr = village ? village.substring(0, 3).toUpperCase() : 'GEN';
  
  // Generate unique 4-character identifier
  const uniqueId = generateUUID().substring(0, 4).toUpperCase();
  
  return `${stateAbbr}-${districtAbbr}-${villageAbbr}-${uniqueId}`;
}

/**
 * Generates a location ID based on hierarchy
 * Format: state_district_subdistrict_village
 */
export function generateLocationId(
  state: string, 
  district: string, 
  subDistrict?: string, 
  village?: string
): string {
  const parts = [
    state.toLowerCase().replace(/\s+/g, '_'),
    district.toLowerCase().replace(/\s+/g, '_')
  ];
  
  if (subDistrict) {
    parts.push(subDistrict.toLowerCase().replace(/\s+/g, '_'));
  }
  
  if (village) {
    parts.push(village.toLowerCase().replace(/\s+/g, '_'));
  }
  
  return parts.join('_');
}

/**
 * Generates a short code for quick reference
 * Format: XXXX-XXXX
 */
export function generateShortCode(): string {
  return generateUUID().substring(0, 8).toUpperCase().replace('-', '');
}
