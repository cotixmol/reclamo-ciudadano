import { UUID } from "crypto";

export enum ClaimStatus {
  Open = 'Open',
  Close = 'Close',
}

export interface ClaimLocation {
  type: "Point";
  coordinates: [number, number];
}

export interface PublicIds {
  publicIds: UUID[];
}
export interface ClaimResponse {
  id: string
  publicId: UUID;
  typeCategoryId: number;
  claimLocation: ClaimLocation;
  title: string;
  description: string;
  status: ClaimStatus;
  createdAt: string;
  updatedAt: string;
  isEdited: boolean;
}

export interface ClaimCreateRequest {
  title: string;
  description: string;
  type_category_id: number;
  status: "Open" | "Close" | string; 
  claim_location: ClaimLocation;
}

export interface ClaimUpdateRequest {
  title: string;
  type_category_id: number;
  description: string;
  status: "Open" | "Close" | string; 
  claim_location: ClaimLocation;
}
