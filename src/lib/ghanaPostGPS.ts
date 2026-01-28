export interface GhanaPostGPSResponse {
    found: boolean;
    data?: {
        Table: Array<{
            Area: string;
            CenterLatitude: number;
            CenterLongitude: number;
            District: string;
            East: number;
            North: number;
            PostCode: string;
            Region: string;
            Street: string;
            Town: string;
        }>;
    };
    message?: string;
}

const API_BASE_URL = process.env.GHANA_POST_GPS_API_URL || 'https://api.ghanapostgps.com/v1/ws';
const API_KEY = process.env.GHANA_POST_GPS_API_KEY;

/**
 * Fetch address details from Ghana Post GPS API
 * @param address The digital address (e.g., GA-183-8164)
 */
export async function getAddressDetails(address: string): Promise<GhanaPostGPSResponse | null> {
    if (!API_KEY) {
        console.warn('Ghana Post GPS API Key is missing in environment variables');
        // Return a mock error or null if strictly required, but let's return null to indicate failure
        return null;
    }

    try {
        // Many legacy APIs use form-data or x-www-form-urlencoded
        const formData = new FormData();
        formData.append('address', address);
        formData.append('key', API_KEY);

        // Note: The specific endpoint might differ based on the API version.
        // Common endpoints: GetLocation.aspx, GetLocation, etc.
        const response = await fetch(`${API_BASE_URL}/GetLocation.aspx`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            console.error(`Ghana Post GPS API Error: ${response.statusText}`);
            return null;
        }

        const data = await response.json();
        return data as GhanaPostGPSResponse;
    } catch (error) {
        console.error('Error fetching Ghana Post GPS data:', error);
        return null;
    }
}

/**
 * Verify if a digital address format is valid (Basic Regex Check)
 * @param address 
 */
export function isValidDigitalAddress(address: string): boolean {
    // Common format: XX-000-0000 or similar
    // Adjust regex based on strict requirements
    const gpsRegex = /^[A-Z]{2}-\d{3,4}-\d{3,4}$/;
    return gpsRegex.test(address);
}
