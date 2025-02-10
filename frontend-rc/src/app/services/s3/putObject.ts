import axios, { AxiosRequestConfig } from 'axios';

const MAX_SIZE = 10 * 1024 * 1024;

export const PutObjectInS3 = async (url: string, file: File): Promise<void> => {
  if (file.size > MAX_SIZE) {
    throw new Error(`Failed to upload ${file.name}. File exceeds the 10MB limit.`);
  }

  try {
    const config: AxiosRequestConfig = {
      headers: {
        'Content-Length': file.size,
        'Content-Type': file.type,
      },
      timeout: 60000,
    };

    const response = await axios.put(url, file, config);

    if (response.status !== 200 && response.status !== 204) {
      throw new Error(
        `Failed to upload ${file.name} to S3. Status Code: ${response.status}.`
      );
    }
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const statusText =
        error.response?.statusText || error.message || 'Unknown error';
      throw new Error(`Failed to upload ${file.name} to S3. ${statusText}`);
    } else {
      throw new Error(`Failed to upload ${file.name} to S3. ${error.message}`);
    }
  }
};
