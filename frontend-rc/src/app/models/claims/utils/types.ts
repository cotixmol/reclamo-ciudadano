export enum ClaimStatus {
  Open = 'Open',
  Close = 'Close',
}

export interface GeometryPoint {
  type: string;
  coordinates: number[];
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
