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
}

export interface ClaimUpdateRequest {
  title?: string;
  type_category_id?: number;
  description?: string;
  status?: 'Open' | 'Close' | string;
  claim_location?: ClaimLocation;
  priority?: PriorityEnum;
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
