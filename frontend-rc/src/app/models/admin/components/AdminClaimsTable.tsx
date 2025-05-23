'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  ClaimWithMultimediaResponse,
  ClaimStatusEnum,
  ClaimResponse,
} from '@/app/models/claims/types/claim';
import { getStatusColor, getPriorityColor } from '@/app/utils/claimColors';
import {
  FiEye,
  FiTrash2,
  FiEdit3,
  FiFilter,
  FiChevronsLeft,
  FiChevronLeft,
  FiChevronRight,
  FiChevronsRight,
} from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import FilterModal, { IAdminTableFilters } from './FilterModal';
import ClaimDetailsModal from './ClaimDetailsModal';
import { deleteClaimByPublicId } from '@/app/services/claims/delete';
import { updateClaimByPublicId } from '@/app/services/claims/update';
import DeleteClaimConfirmationPopUp from '@/app/models/claims/components/DeleteClaimConfirmationPopUp';
import EditStatusModal from './ClaimEditStatusModal';

interface AdminClaimsTableProps {
  claimsData: ClaimWithMultimediaResponse[];
  totalUnfilteredClaims: number;
  allClaimTypes: { value: number; label: string }[];
  activeFilters: IAdminTableFilters;
  onFiltersChange: (newFilters: IAdminTableFilters) => void;
  onClaimUpdated?: () => void;
  onClaimDeleted?: () => void;
}

const AdminClaimsTable: React.FC<AdminClaimsTableProps> = ({
  claimsData,
  totalUnfilteredClaims,
  allClaimTypes,
  activeFilters,
  onFiltersChange,
  onClaimUpdated,
  onClaimDeleted,
}) => {
  const { t, i18n } = useTranslation(['admin', 'claim', 'claimcreationform']);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showFilterModal, setShowFilterModal] = useState(false);

  const [claimToDelete, setClaimToDelete] = useState<string | null>(null);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);

  const [claimToEditStatus, setClaimToEditStatus] =
    useState<ClaimResponse | null>(null);
  const [isEditStatusModalOpen, setIsEditStatusModalOpen] = useState(false);

  const [claimToViewDetails, setClaimToViewDetails] =
    useState<ClaimWithMultimediaResponse | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  useEffect(() => {
    setCurrentPage(1);
  }, [claimsData, itemsPerPage]);

  const totalPages = Math.ceil(claimsData.length / itemsPerPage);
  const paginatedClaims = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return claimsData.slice(startIndex, endIndex);
  }, [claimsData, currentPage, itemsPerPage]);

  const handlePageChange = (page: number) => {
    if ((page >= 1 && page <= totalPages) || (totalPages === 0 && page === 1)) {
      setCurrentPage(page);
    }
  };

  const handleItemsPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setItemsPerPage(Number(e.target.value));
  };

  const getClaimTypeName = (typeId: number | undefined) => {
    if (typeId === undefined) return t('admin:unknown', 'Desconocido');
    const claimType = allClaimTypes.find((ct) => ct.value === typeId);
    return claimType ? claimType.label : t('admin:unknown', 'Desconocido');
  };

  const openDetailsModal = (claimFullData: ClaimWithMultimediaResponse) => {
    setClaimToViewDetails(claimFullData);
    setIsDetailsModalOpen(true);
  };

  const openEditStatusModal = (claim: ClaimResponse) => {
    setClaimToEditStatus(claim);
    setIsEditStatusModalOpen(true);
  };

  const handleSaveStatus = async (
    publicId: string,
    newStatus: ClaimStatusEnum
  ) => {
    try {
      await updateClaimByPublicId(publicId, { status: newStatus });
      if (onClaimUpdated) onClaimUpdated();
    } catch (error) {
      console.error('Error updating claim status:', error);
      alert(t('admin:statusUpdateError', 'Error al actualizar el estado'));
    }
    setIsEditStatusModalOpen(false);
    setClaimToEditStatus(null);
  };

  const openDeleteConfirmation = (publicId: string) => {
    setClaimToDelete(publicId);
    setIsDeletePopupOpen(true);
  };

  const handleDeleteConfirmed = async () => {
    if (!claimToDelete) return;
    try {
      await deleteClaimByPublicId(claimToDelete);
      if (onClaimDeleted) onClaimDeleted();
    } catch (error) {
      console.error('Error deleting claim:', error);
      alert(t('admin:deleteError', 'Error al eliminar el reclamo'));
    }
    setIsDeletePopupOpen(false);
    setClaimToDelete(null);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString(i18n.language, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
    } catch (e) {
      return 'Invalid Date';
    }
  };

  const firstItemIndex =
    claimsData.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const lastItemIndex =
    claimsData.length > 0
      ? Math.min(currentPage * itemsPerPage, claimsData.length)
      : 0;

  const renderPaginationControls = () => {
    const pageNumbers = [];
    const maxPagesToShow = 3;
    let startPage, endPage;

    if (totalPages <= maxPagesToShow + 2) {
      startPage = 1;
      endPage = totalPages;
    } else {
      if (currentPage <= Math.ceil(maxPagesToShow / 2) + 1) {
        startPage = 1;
        endPage = maxPagesToShow;
      } else if (
        currentPage + Math.floor(maxPagesToShow / 2) >=
        totalPages - 1
      ) {
        startPage = totalPages - maxPagesToShow + 1;
        endPage = totalPages;
      } else {
        startPage = currentPage - Math.floor(maxPagesToShow / 2);
        endPage = currentPage + Math.floor(maxPagesToShow / 2);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    // Do not show pagination if there is no filtered data OR if there are no claims in total (before filtering)
    if (claimsData.length === 0 && totalUnfilteredClaims === 0) return null;

    return (
      // Flex container to align counter to the left and pagination to the right
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 text-sm text-RCColors-300">
        {/* Pagination and total information */}
        <div className="whitespace-nowrap">
          {
            claimsData.length > 0
              ? t(
                  'admin:pagination.showing',
                  'Mostrando {{first}} a {{last}} de {{total}} reclamos',
                  {
                    first: firstItemIndex,
                    last: lastItemIndex,
                    total: claimsData.length, // total number of filtered claims shown in the table
                  }
                )
              : // If there are no claimsData (filtered) but there are active filters, it means that the filters did not produce results.
                activeFilters.searchTerm ||
                  activeFilters.status !== 'all' ||
                  activeFilters.priority !== 'all' ||
                  activeFilters.typeCategoryId !== 'all' ||
                  activeFilters.dateFrom ||
                  activeFilters.dateTo
                ? t(
                    'admin:pagination.noResultsAfterFilter',
                    '0 reclamos con filtros aplicados'
                  )
                : t('admin:pagination.noResults', '0 reclamos') // If there are no filters and no claims.
          }
          {totalUnfilteredClaims > 0 &&
            claimsData.length !== totalUnfilteredClaims && (
              <span className="ml-1 text-RCColors-400">
                (
                {t(
                  'admin:pagination.outOfTotal',
                  'de {{totalUnfiltered}} en total',
                  { totalUnfiltered: totalUnfilteredClaims }
                )}
                )
              </span>
            )}
        </div>

        {/* Pagination controls (only if there is more than one page of filtered results) */}
        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className="p-1.5 rounded hover:bg-RCColors-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-1 focus:ring-RCColors-500"
              aria-label={t('admin:pagination.first', 'Primera página')}
            >
              <FiChevronsLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-1.5 rounded hover:bg-RCColors-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-1 focus:ring-RCColors-500"
              aria-label={t('admin:pagination.previous', 'Página anterior')}
            >
              <FiChevronLeft className="w-5 h-5" />
            </button>
            {startPage > 1 && <span className="px-1.5 py-1">...</span>}
            {pageNumbers.map((number) => (
              <button
                key={number}
                onClick={() => handlePageChange(number)}
                className={`px-2.5 py-1 rounded text-sm font-medium transition-colors
                  ${currentPage === number ? 'bg-primary text-white' : 'hover:bg-RCColors-700 text-RCColors-200 focus:outline-none focus:ring-1 focus:ring-RCColors-500'}`}
              >
                {number}
              </button>
            ))}
            {endPage < totalPages && <span className="px-1.5 py-1">...</span>}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded hover:bg-RCColors-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-1 focus:ring-RCColors-500"
              aria-label={t('admin:pagination.next', 'Página siguiente')}
            >
              <FiChevronRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded hover:bg-RCColors-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-1 focus:ring-RCColors-500"
              aria-label={t('admin:pagination.last', 'Última página')}
            >
              <FiChevronsRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="rounded-md border border-RCColors-700 bg-RCColors-800 p-4 md:p-5 shadow-lg">
      <div className="mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-sm text-RCColors-300 whitespace-nowrap">
            {t('admin:itemsPerPage', 'Mostrar:')}
          </span>
          <select
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className="bg-RCColors-700 border border-RCColors-600 text-RCColors-100 text-sm rounded-md p-2 focus:ring-primary focus:border-primary appearance-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 0.5rem center',
              backgroundSize: '1.5em 1.5em',
              paddingRight: '2.5rem',
            }}
          >
            {[10, 25, 50, 100].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={() => setShowFilterModal(true)}
          className="flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-opacity-80 outline-none transition-colors duration-200"
        >
          <FiFilter className="w-4 h-4" />
          {t('admin:filter', 'Filtrar')}
        </button>
      </div>

      <div className="max-w-full overflow-x-auto rounded-t-md">
        <table className="w-full table-auto">
          <thead className="bg-RCColors-700">
            <tr className="text-left">
              <th className="min-w-[320px] py-2.5 px-3 font-medium text-RCColors-100 xl:pl-8 border-r border-RCColors-600">
                {t('admin:title', 'Título')}
              </th>
              <th className="min-w-[110px] py-2.5 px-3 font-medium text-RCColors-100 border-r border-RCColors-600 text-center">
                {t('admin:creationDate', 'Fecha')}
              </th>
              <th className="min-w-[140px] py-2.5 px-3 font-medium text-RCColors-100 border-r border-RCColors-600 text-center">
                {t('admin:type', 'Tipo')}
              </th>
              <th className="min-w-[90px] py-2.5 px-3 font-medium text-RCColors-100 border-r border-RCColors-600 text-center">
                {t('admin:status', 'Estado')}
              </th>
              <th className="min-w-[90px] py-2.5 px-3 font-medium text-RCColors-100 border-r border-RCColors-600 text-center">
                {t('admin:priority', 'Prioridad')}
              </th>
              <th className="w-[110px] py-2.5 px-3 font-medium text-RCColors-100 text-center">
                {t('admin:actions', 'Acciones')}
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedClaims.length > 0 ? (
              paginatedClaims.map((claimData) => {
                const claim = claimData.claim;
                return (
                  <tr
                    key={claim.publicId}
                    className="border-b border-RCColors-700 hover:bg-RCColors-700/70 transition-colors duration-150"
                  >
                    <td className="py-3 px-3 xl:pl-8 border-r border-RCColors-600">
                      <p
                        className="font-medium text-RCColors-100 truncate max-w-[250px] text-sm"
                        title={claim.title}
                      >
                        {claim.title}
                      </p>
                      <p className="text-xs text-RCColors-400">
                        {claim.publicId}
                      </p>
                    </td>
                    <td className="py-3 px-3 border-r border-RCColors-600 text-center">
                      <p className="text-sm text-RCColors-200">
                        {formatDate(claim.createdAt)}
                      </p>
                    </td>
                    <td className="py-3 px-3 border-r border-RCColors-600">
                      <p
                        className="text-sm text-RCColors-200 truncate text-center"
                        title={getClaimTypeName(claim.typeCategoryId)}
                      >
                        {getClaimTypeName(claim.typeCategoryId)}
                      </p>
                    </td>
                    <td className="py-3 px-3 border-r border-RCColors-600 text-center">
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${getStatusColor(claim.status).replace('bg-', 'text-')} ${getStatusColor(claim.status).replace('400', '100')} bg-opacity-15`}
                      >
                        {t(`claim:status.${claim.status}`, claim.status)}
                      </span>
                    </td>
                    <td className="py-3 px-3 border-r border-RCColors-600 text-center">
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${getPriorityColor(claim.priority).replace('bg-', 'text-')} ${getPriorityColor(claim.priority).replace('400', '100')} bg-opacity-15`}
                      >
                        {t(
                          `claimcreationform:priority.${claim.priority}`,
                          claim.priority
                        )}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center space-x-1.5">
                        <button
                          onClick={() => openDetailsModal(claimData)}
                          title={t('admin:viewDetails', 'Ver Detalles')}
                          className="p-1.5 rounded text-RCColors-300 hover:bg-RCColors-600 hover:text-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        >
                          <FiEye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEditStatusModal(claim)}
                          title={t('admin:editStatus', 'Editar Estado')}
                          className="p-1.5 rounded text-RCColors-300 hover:bg-RCColors-600 hover:text-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        >
                          <FiEdit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openDeleteConfirmation(claim.publicId)}
                          title={t('admin:deleteClaim', 'Eliminar Reclamo')}
                          className="p-1.5 rounded text-RCColors-300 hover:bg-RCColors-600 hover:text-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="py-8 px-4 text-center text-RCColors-400"
                >
                  {activeFilters.searchTerm ||
                  activeFilters.status !== 'all' ||
                  activeFilters.priority !== 'all' ||
                  activeFilters.typeCategoryId !== 'all' ||
                  activeFilters.dateFrom ||
                  activeFilters.dateTo
                    ? t(
                        'admin:noClaimsFoundWithFilters',
                        'No hay reclamos que coincidan con los filtros.'
                      )
                    : t(
                        'admin:noClaimsYet',
                        'Aún no hay reclamos para este cliente.'
                      )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {(claimsData.length > 0 ||
        (totalUnfilteredClaims > 0 &&
          !Object.values(activeFilters).some(
            (f) => f !== 'all' && f !== ''
          ))) &&
        renderPaginationControls()}

      {showFilterModal && (
        <FilterModal
          isOpen={showFilterModal}
          onClose={() => setShowFilterModal(false)}
          activeFilters={activeFilters}
          onApplyFilters={onFiltersChange}
          allClaimTypes={allClaimTypes}
        />
      )}
      {isDeletePopupOpen && claimToDelete && (
        <DeleteClaimConfirmationPopUp
          isOpen={isDeletePopupOpen}
          onClose={() => setIsDeletePopupOpen(false)}
          onConfirm={handleDeleteConfirmed}
        />
      )}
      {isEditStatusModalOpen && claimToEditStatus && (
        <EditStatusModal
          isOpen={isEditStatusModalOpen}
          onClose={() => setIsEditStatusModalOpen(false)}
          currentClaim={claimToEditStatus}
          onSave={handleSaveStatus}
        />
      )}
      {isDetailsModalOpen && claimToViewDetails && (
        <ClaimDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          initialClaimData={claimToViewDetails.claim}
        />
      )}
    </div>
  );
};

export default AdminClaimsTable;
