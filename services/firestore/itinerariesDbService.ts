import { useSession } from '@/context/SessionContext';

export async function saveItinerary(itinerary: any) {
  try {
    const response = await fetch('https://tarag-backend.onrender.com/api/itinerary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(itinerary),
    });
    const data = await response.json();
    if (response.ok) {
      return { success: true, errorMessage: undefined, data };
    } else {
      return { success: false, errorMessage: data.error || 'Failed to save itinerary', data };
    }
  } catch (err: any) {
    return { success: false, errorMessage: err.message || 'Failed to save itinerary', data: undefined };
  }
}

// Get itineraries by user (hook version)
export function useGetItinerariesByUser() {
  const { session } = useSession();
  const userID = session?.user?.id;
  const getItineraries = async () => {
    if (!userID) return { success: false, errorMessage: 'No user ID', data: undefined };
    try {
      const response = await fetch(`https://tarag-backend.onrender.com/api/itinerary/user/${userID}`);
      const data = await response.json();
      if (response.ok) {
        return { success: true, errorMessage: undefined, data: data.itineraries };
      } else {
        return { success: false, errorMessage: data.error || 'Failed to fetch itineraries', data: undefined };
      }
    } catch (err: any) {
      return { success: false, errorMessage: err.message || 'Failed to fetch itineraries', data: undefined };
    }
  };
  return getItineraries;
}

// Get itinerary by ID
export async function getItinerariesById(id: string) {
  try {
    const response = await fetch(`https://tarag-backend.onrender.com/api/itinerary/${id}`);
    const data = await response.json();
    if (response.ok) {
      return { success: true, errorMessage: undefined, data };
    } else {
      return { success: false, errorMessage: data.error || 'Failed to fetch itinerary', data: undefined };
    }
  } catch (err: any) {
    return { success: false, errorMessage: err.message || 'Failed to fetch itinerary', data: undefined };
  }
}

// Delete itinerary by ID
export async function deleteItinerary(id: string) {
  try {
    const response = await fetch(`https://tarag-backend.onrender.com/api/itinerary/${id}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    if (response.ok && data.success) {
      return { success: true };
    } else {
      return { success: false, errorMessage: data.error || 'Failed to delete itinerary' };
    }
  } catch (err: any) {
    return { success: false, errorMessage: err.message || 'Failed to delete itinerary' };
  }
}
