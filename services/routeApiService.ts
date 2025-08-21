import { BACKEND_URL } from '@/constants/Config';

export async function getRoutes(params: {
  location: { latitude: number; longitude: number; locationName?: string }[];
  mode: string;
  alternatives?: boolean;
}) {
  try {
    const res = await fetch(`${BACKEND_URL}/routes/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        location: params.location,
        mode: params.mode,
        alternatives: params.alternatives ?? true,
      }),
    });
    if (!res.ok) throw new Error('Failed to fetch routes');
    const data = await res.json();
    return data.routes || [];
  } catch (err) {
    console.error('getRoutes error:', err);
    return [];
  }
}