import axios from 'axios';

export interface CookieData {
  authenticated: boolean;
  // these will only exist when authenticated===true
  sub?: string;
  email?: string;
  client?: number;
  role?: string;
  exp?: number;
}

export async function fetchCookieData(): Promise<CookieData> {
  try {
    const response = await axios.get<CookieData>(
      `${process.env.NEXT_PUBLIC_INTERNAL_API_URL}/login/get_cookie`,
      { withCredentials: true }
    );
    return response.data;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 401) {
      return { authenticated: false };
    }
    throw new Error('Failed to fetch cookie data');
  }
}
