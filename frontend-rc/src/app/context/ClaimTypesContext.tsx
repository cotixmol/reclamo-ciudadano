'use client';
import React, { createContext, useContext } from 'react';
import { RawClaimTypesResponse } from '../models/claimTypes/types/claimTypes';

type ClaimsContextType = {
  claimTypes: RawClaimTypesResponse[];
};

const ClaimsContext = createContext<ClaimsContextType | undefined>(undefined);

export function ClaimTypesProvider({
  claimTypes,
  children,
}: {
  claimTypes: RawClaimTypesResponse[];
  children: React.ReactNode;
}) {
  return (
    <ClaimsContext.Provider value={{ claimTypes }}>
      {children}
    </ClaimsContext.Provider>
  );
}

export function useClaimTypes() {
  const context = useContext(ClaimsContext);
  if (!context) {
    throw new Error('useClaimTypes must be used within a ClaimsProvider');
  }
  return context.claimTypes;
}
