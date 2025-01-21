'use client';
import React, { createContext, useContext } from 'react';
import { ClaimTypesResponse } from '../models/claimTypes/types/claimTypes';

type ClaimsContextType = {
  claimTypes: ClaimTypesResponse[];
};

const ClaimsContext = createContext<ClaimsContextType | undefined>(undefined);

export function ClaimTypesProvider({
  claimTypes,
  children,
}: {
  claimTypes: ClaimTypesResponse[];
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
