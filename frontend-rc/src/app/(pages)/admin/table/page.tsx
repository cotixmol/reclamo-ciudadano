'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import '@/app/i18n';
import { fetchAllClaimsByClientId } from '@/app/services/admin/claims/fetch';
import { ClaimWithMultimediaResponse } from '@/app/models/claims/types/claim';
import LoadingScreen from '@/app/components/LoadingScreen';
import ErrorPage from '@/app/components/ErrorPage';
import { useClaimTypes } from '@/app/context/ClaimTypesContext';
import { RawClaimTypesResponse } from '@/app/models/claimTypes/types/claimTypes';
import { IAdminTableFilters } from '@/app/models/admin/components/FilterModal';
import AdminClaimsTable from '@/app/models/admin/components/AdminClaimsTable';

export default function AdminTablePage() {
  const { t, i18n } = useTranslation(['admin', 'claim']);
  const claimTypesContext = useClaimTypes();

  const [claims, setClaims] = useState<ClaimWithMultimediaResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeFilters, setActiveFilters] = useState<IAdminTableFilters>({
    searchTerm: '',
    status: 'all',
    priority: 'all',
    typeCategoryId: 'all',
    dateFrom: '',
    dateTo: '',
    includeDeleted: false, 
  });

  const clientPublicId = process.env.NEXT_PUBLIC_CLIENT_PUBLIC_ID;

  // Renamed for clarity
  const fetchClaims = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    if (!clientPublicId) {
      setError(
        t('admin:missingClientPublicId', 'Falta el ID público del cliente.')
      );
      setIsLoading(false);
      setClaims([]);
      console.warn('Missing NEXT_PUBLIC_CLIENT_PUBLIC_ID');
      return;
    }
    try {
      const claimsData = await fetchAllClaimsByClientId(clientPublicId);
      setClaims(claimsData.reverse());
    } catch (err: unknown) {
      // Improved error handling
      if (err instanceof Error) {
        setError(
          err.message ||
            t('admin:errorFetchingClaims', 'Error al obtener los reclamos.')
        );
      } else {
        setError(
          t('admin:errorFetchingClaims', 'Error al obtener los reclamos.')
        );
      }
      setClaims([]);
      // Optionally log for debugging
      console.error('Error fetching claims:', err);
    } finally {
      setIsLoading(false);
    }
  }, [t, clientPublicId]);

  useEffect(() => {
    fetchClaims();
  }, [fetchClaims]);

  // Renamed for clarity
  const claimTypeOptions = useMemo(() => {
    return claimTypesContext.map((ct: RawClaimTypesResponse) => ({
      value: ct.id,
      label: i18n.language === 'es' ? ct.categoryEs : ct.categoryEn,
    }));
  }, [claimTypesContext, i18n.language]);

  // Renamed for clarity
  const filteredClaims = useMemo(() => {
    return claims.filter((claimData) => {
      const claim = claimData.claim;

      if (!activeFilters.includeDeleted && claim.deleted) {
        return false;
      }

      const lowerSearchTerm = activeFilters.searchTerm.toLowerCase();

      const matchesSearchTerm =
        !activeFilters.searchTerm ||
        claim.title.toLowerCase().includes(lowerSearchTerm) ||
        claim.publicId.toLowerCase().includes(lowerSearchTerm);

      const matchesStatus =
        activeFilters.status === 'all' || claim.status === activeFilters.status;
      const matchesPriority =
        activeFilters.priority === 'all' ||
        claim.priority === activeFilters.priority;
      const matchesTypeCategory =
        activeFilters.typeCategoryId === 'all' ||
        claim.typeCategoryId === Number(activeFilters.typeCategoryId);

      let matchesDate = true;
      if (activeFilters.dateFrom || activeFilters.dateTo) {
        const claimDate = new Date(claim.createdAt).getTime();
        if (activeFilters.dateFrom) {
          const fromDate = new Date(activeFilters.dateFrom).getTime();
          if (isNaN(fromDate) || claimDate < fromDate) matchesDate = false;
        }
        if (matchesDate && activeFilters.dateTo) {
          const toDate = new Date(activeFilters.dateTo);
          toDate.setHours(23, 59, 59, 999);
          if (isNaN(toDate.getTime()) || claimDate > toDate.getTime())
            matchesDate = false;
        }
      }

      return (
        matchesSearchTerm &&
        matchesStatus &&
        matchesPriority &&
        matchesTypeCategory &&
        matchesDate
      );
    });
  }, [claims, activeFilters]);

  // Renamed for clarity
  const handleFiltersChange = (newFilters: IAdminTableFilters) => {
    setActiveFilters(newFilters);
  };

  if (isLoading && !claims.length) {
    return <LoadingScreen />;
  }

  if (error && !claims.length) {
    return <ErrorPage message={error} />;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-RCColors-100">
        {t('admin:table.title', 'Gestión de reclamos')}
      </h1>
      <AdminClaimsTable
        claimsData={filteredClaims}
        totalUnfilteredClaims={claims.length}
        allClaimTypes={claimTypeOptions}
        activeFilters={activeFilters}
        onFiltersChange={handleFiltersChange}
        onClaimUpdated={fetchClaims}
        onClaimDeleted={fetchClaims}
      />
    </div>
  );
}
