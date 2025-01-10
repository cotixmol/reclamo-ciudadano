export interface GeometryPoint {
    type: string;
    coordinates: number[]; 
  }
  
  export enum ClaimStatus {
    Pending = 'pending',
    InProgress = 'in progress',
    Resolved = 'resolved',
    Rejected = 'rejected',
  }
  
  export interface Claim {
    id: number;
    typeCategoryId: number;
    claimLocation: GeometryPoint;
    title: string;
    description: string;
    status: ClaimStatus;
    createdAt: string;
    updatedAt: string;
    isEdited: boolean;
  }