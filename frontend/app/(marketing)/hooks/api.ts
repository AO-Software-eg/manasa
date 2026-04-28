import axios from 'axios';
import { API_URL } from '@/app/config/config';

export const api = axios.create({
  baseURL: API_URL,
});

// Fetches session data from the api's /me route
export async function getSessionData(): Promise<Object | null> {
  try {
    const res = await api.get('/me', {
      withCredentials: true,
    });

    if (!res.data.sessionData) {
      throw new Error(
        'Invalid /me response, status 200 but session data is undefined.',
      );
    }

    return res.data.sessionData;
  } catch (err: unknown) {
    console.log(err);

    return null;
  }
}
