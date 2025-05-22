import axios from 'axios';

export async function AdminLogin(email: string, password: string): Promise<void> {
  try {
    if (!email || !password) {
      throw new Error('Credentials are required');
    }
    await axios.post(
      `${process.env.NEXT_PUBLIC_INTERNAL_API_URL}/admin/login`,
      { email, password }
    );
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      throw new Error('Credentials are invalid');
    }
    throw new Error('An error occurred during login');
  }
}
