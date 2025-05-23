import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_INTERNAL_API_URL!

export async function AdminLogin(email: string, password: string) {
  try {
    if (!email || !password) {
      throw new Error('Credentials are required');
    }
    const url = `${BASE_URL}/admin/login`
    await axios.post(url, { email, password })
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      throw new Error('Credentials are invalid');
    }
    throw new Error('An error occurred during login');
  }
}


