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
  const allClaimTypesContext = useClaimTypes();

  const [allFetchedClaims, setAllFetchedClaims] = useState<
    ClaimWithMultimediaResponse[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeFilters, setActiveFilters] = useState<IAdminTableFilters>({
    searchTerm: '',
    status: 'all',
    priority: 'all',
    typeCategoryId: 'all',
    dateFrom: '',
    dateTo: '',
  });

  const clientPublicId = process.env.NEXT_PUBLIC_CLIENT_PUBLIC_ID;
  console.log(clientPublicId);

  const loadClaims = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    if (!clientPublicId) {
      setError(
        t('admin:missingClientPublicId', 'Falta el ID público del cliente.')
      );
      setIsLoading(false);
      setAllFetchedClaims([]);
      return;
    }
    try {
      const claimsData = await fetchAllClaimsByClientId(clientPublicId);
      setAllFetchedClaims(claimsData.reverse());
    } catch (err: any) {
      setError(
        err.message ||
          t('admin:errorFetchingClaims', 'Error al obtener los reclamos.')
      );
      setAllFetchedClaims([]);
    } finally {
      setIsLoading(false);
    }
  }, [t, clientPublicId]);

  useEffect(() => {
    loadClaims();
  }, [loadClaims]);

  const claimTypesForFilter = useMemo(() => {
    return allClaimTypesContext.map((ct: RawClaimTypesResponse) => ({
      value: ct.id,
      label: i18n.language === 'es' ? ct.categoryEs : ct.categoryEn,
    }));
  }, [allClaimTypesContext, i18n.language]);

  const filteredClaimsForTable = useMemo(() => {
    return allFetchedClaims.filter((claimData) => {
      const claim = claimData.claim;
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
          if (claimDate < fromDate) matchesDate = false;
        }
        if (matchesDate && activeFilters.dateTo) {
          const toDate = new Date(activeFilters.dateTo);
          toDate.setHours(23, 59, 59, 999);
          if (claimDate > toDate.getTime()) matchesDate = false;
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
  }, [allFetchedClaims, activeFilters]);

  const handleApplyFiltersFromModal = (
    newFiltersFromModal: IAdminTableFilters
  ) => {
    setActiveFilters(newFiltersFromModal);
  };

  if (isLoading && !allFetchedClaims.length) {
    return <LoadingScreen />;
  }

  if (error && !allFetchedClaims.length) {
    return <ErrorPage message={error} />;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-RCColors-100">
        {t('admin:table.title', 'Gestión de reclamos')}
      </h1>
      <AdminClaimsTable
        claimsData={filteredClaimsForTable}
        totalUnfilteredClaims={allFetchedClaims.length}
        allClaimTypes={claimTypesForFilter}
        activeFilters={activeFilters}
        onFiltersChange={handleApplyFiltersFromModal}
        onClaimUpdated={loadClaims}
        onClaimDeleted={loadClaims}
      />
    </div>
  );
}
