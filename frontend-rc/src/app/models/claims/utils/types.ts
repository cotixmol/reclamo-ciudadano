import { UUID } from "crypto";

/** Enums **/
export enum ClaimStatus {
  Open = 'Open',
  Close = 'Close',
}

/** Fundamental Interfaces **/
export interface ClaimLocation {
  type: "Point";
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
  status?: "Open" | "Close" | string;
  claim_location: ClaimLocation;
}

export interface ClaimUpdateRequest {
  title: string;
  type_category_id: number;
  description: string;
  status?: "Open" | "Close" | string;
  claim_location: ClaimLocation;
}

/** API Response Interfaces **/
export interface ClaimResponse {
  id: number;
  publicId: UUID;
  typeCategoryId: number;
  claimLocation: ClaimLocation;
  title: string;
  description: string;
  status: ClaimStatus;
  createdAt: string;
  updatedAt: string;
}

export type ClaimListResponse = ClaimResponse[];
