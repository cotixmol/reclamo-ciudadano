export const PutObjectInS3 = async (url: string, file: File): Promise<void> => {
    const response = await fetch(url, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });
  
    if (!response.ok) {
      throw new Error(`Failed to upload ${file.name} to S3.`);
    }
  };
  