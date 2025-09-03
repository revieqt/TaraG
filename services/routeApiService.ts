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