'use server';

import { getAddressDetails } from '@/lib/ghanaPostGPS';

export async function verifyGpsAddress(gpsAddress: string) {
    if (!gpsAddress) return { success: false, message: 'Address is required' };

    try {
        const result = await getAddressDetails(gpsAddress);
        if (result && result.found && result.data && result.data.Table && result.data.Table.length > 0) {
            const details = result.data.Table[0];
            // Format a nice address string
            const formattedAddress = `${details.Street}, ${details.Area}, ${details.Town}, ${details.Region}`;
            return {
                success: true,
                data: details,
                formattedAddress
            };
        } else {
            return { success: false, message: 'Address not found or invalid' };
        }
    } catch (error) {
        console.error('Error verifying GPS address:', error);
        return { success: false, message: 'Failed to verify address' };
    }
}
