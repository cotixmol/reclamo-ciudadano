import axios from 'axios';

export async function AdminLogin(email: string, password: string) {
  try {
    if (!email || !password) {
      throw new Error('Credentials are required');
    }
    const url = `${process.env.NEXT_PUBLIC_INTERNAL_API_URL}/login`
    return axios.post(url, { email, password }, {
      withCredentials: true,
    });
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      throw new Error('Credentials are invalid');
    }
    throw new Error('An error occurred during login');
  }
}


