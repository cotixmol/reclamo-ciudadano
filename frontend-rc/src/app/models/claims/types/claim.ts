import { UUID } from 'crypto';

/** Enums **/
export enum ClaimStatusEnum {
  Open = 'Open',
  Close = 'Close',
}

export enum PriorityEnum {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

/** Fundamental Interfaces **/
export interface ClaimLocation {
  type: 'Point';
  coordinates: [number, number];
}

/** API Request Interfaces **/
export interface ApiPublicIdsRequest {
  publicIds: UUID[];
}

export interface ClaimCreateRequest {
  title: string;
  description: string;
  type_category_id: number;
  status: 'Open' | 'Close' | string;
  claim_location: ClaimLocation;
  priority: PriorityEnum;
  files: string[];
}

export interface ClaimUpdateRequest {
  title?: string;
  type_category_id?: number;
  description?: string;
  status?: 'Open' | 'Close' | string;
  claim_location?: ClaimLocation;
  priority?: PriorityEnum;
}

export interface MultimediaMetadataRequest {
  claim_id: number;
  s3_url: string;
  file_name: string;
  file_type: string;
  file_size: number;
}

/** API Response Interfaces **/
export interface ClaimResponse {
  id: number;
  publicId: UUID;
  typeCategoryId: number;
  claimLocation: ClaimLocation;
  title: string;
  description: string;
  status: ClaimStatusEnum;
  priority: PriorityEnum;
  hasMultimedia: boolean;
  createdAt: string;
  updatedAt: string;
  deleted: boolean;
  deletedAt: string;
}

/** Error Response Interface **/
export interface ClaimErrorResponse {
  detail: string;
}

/** Create New Claim Response Interface **/
export interface CreateNewClaimResponse {
  newClaim: ClaimResponse;
  presignedUrl: Record<string, string>;
}

/** Create New Multimedia Metadata Response Interface **/
export interface MultimediaMetadataResponse {
  id: number;
  s3Url: string;
  fileName: string;
  claimId: number;
  uploadedAt: string;
  fileType: string;
  fileSize: number;
}

/** Multimedia Metadata Response Interface **/
export interface MultimediaErrorResponse {
  detail: string;
}
