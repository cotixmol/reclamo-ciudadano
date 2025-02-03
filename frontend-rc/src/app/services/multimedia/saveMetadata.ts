
import { 
  MultimediaMetadataRequest, 
  MultimediaMetadataResponse 
} from '@/app/models/claims/types/claim';
import axios from 'axios';


export const saveMetadata = async (
  id: number,
  presignedUrl: Record<string, string>,
  files: File[]
): Promise<void> => {
  try {
    const fileMetadataArray: MultimediaMetadataRequest[] = files.map((file) => {
      const rawUrl = presignedUrl[file.name];
      const s3Url = rawUrl.split('?')[0];
      return {
        claim_id: id,
        s3_url: s3Url,
        file_name: file.name,
        file_type: file.type,
        file_size: file.size,
      };
    });

    await axios.post<MultimediaMetadataResponse[]>(
      `/api/multimedia/${id}/create`,
      fileMetadataArray
    );
  } catch (error) {
    console.error('Error saving metadata:', error);
    if (axios.isAxiosError(error) && error.response) {
      const { data } = error.response;
      throw new Error(data?.error || 'Failed to save metadata');
    }
    throw new Error('An unknown error occurred while saving metadata');
  }
};
