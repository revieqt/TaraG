import { BACKEND_URL } from '@/constants/Config';

export async function getRoutes(params: {
  location: { latitude: number; longitude: number }[];
  mode: string;
}) {
  try {
    const res = await fetch(`${BACKEND_URL}/routes/get`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        location: params.location,
        mode: params.mode,
      }),
    });
    if (!res.ok) throw new Error('Failed to fetch routes');
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('getRoutes error:', err);
    return null;
  }
}

export async function generateRouteWithLocations(params: {
  startLocation: { latitude: number; longitude: number };
  endLocation: { latitude: number; longitude: number };
  waypoints: { latitude: number; longitude: number }[];
  mode: string;
  userID: string;
}) {
  const { startLocation, endLocation, waypoints, mode, userID } = params;
  
  if (!mode || !endLocation || !userID || !startLocation) {
    console.log('Missing required data for route generation');
    return null;
  }

  try {
    // Build location array: start -> waypoints -> end
    const locationArray = [
      startLocation, // Starting location
      ...waypoints, // Waypoints
      endLocation // End location
    ];

    const route = await getRoutes({
      location: locationArray,
      mode: mode
    });

    if (route) {
      console.log('Route generated:', route);
      return route;
    } else {
      console.log('Failed to generate route');
      return null;
    }
  } catch (error) {
    console.error('Error generating route:', error);
    return null;
  }
}

export async function createRoute(params: {
  userID: string;
  status: string;
  mode: string;
  location: { latitude: number; longitude: number; locationName: string }[];
}, accessToken: string) {
  try {
    const res = await fetch(`${BACKEND_URL}/routes/create`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(params),
    });
    if (!res.ok) throw new Error('Failed to create route');
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('createRoute error:', err);
    return null;
  }
}