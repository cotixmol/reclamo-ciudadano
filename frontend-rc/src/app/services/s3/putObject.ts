import axios, { AxiosRequestConfig } from 'axios';

export const PutObjectInS3 = async (url: string, file: File): Promise<void> => {
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
      console.error('Unexpected response:', {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        data: response.data,
      });
      throw new Error(`Failed to upload ${file.name} to S3. Status Code: ${response.status}.`);
    }
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error occurred:', {
        message: error.message,
        code: error.code,
        config: error.config,
        request: error.request,
        response: error.response
          ? {
              status: error.response.status,
              statusText: error.response.statusText,
              headers: error.response.headers,
              data: error.response.data,
            }
          : null,
        stack: error.stack,
      });
      const statusText = error.response?.statusText || error.message || 'Unknown error';
      throw new Error(`Failed to upload ${file.name} to S3. ${statusText}`);
    } else {
      console.error('Non-Axios error occurred:', error);
      throw new Error(`Failed to upload ${file.name} to S3. ${error.message}`);
    }
  }
};
