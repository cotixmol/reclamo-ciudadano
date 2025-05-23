'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import '@/app/i18n';
import { fetchAllClaimsByClientId } from '@/app/services/admin/claims/fetch';
import {
  ClaimWithMultimediaResponse,
  PriorityEnum,
  ClaimStatusEnum,
} from '@/app/models/claims/types/claim';
import { useClaimTypes } from '@/app/context/ClaimTypesContext';
import LoadingScreen from '@/app/components/LoadingScreen';
import ErrorPage from '@/app/components/ErrorPage';
import {
  FaChartLine,
  FaExclamationTriangle,
  FaListAlt,
  FaTasks,
} from 'react-icons/fa';
import PieChartComponent from '@/app/components/charts/PieChartComponent';
import BarChartComponent from '@/app/components/charts/BarChartComponent';
import TimelineChartComponent from '@/app/components/charts/TimelineChartComponent';
import KeyValueDisplay from '@/app/components/charts/KeyValueDisplay';

interface ChartData {
  pieClaimTypes: Array<{ value: number; name: string }>;
  piePriorities: Array<{ value: number; name: string }>;
  totals: { total: number; inProgress: number; critical: number };
  barStatuses: { xAxis: string[]; series: number[] };
  timeline: {
    xAxis: string[];
    series: echarts.LineSeriesOption[];
    legend: string[];
  };
}

const getDatesInRange = (startDate: Date, endDate: Date): string[] => {
  const dates: string[] = [];
  let currentDate = new Date(startDate.toISOString().split('T')[0]); // Normalize to YYYYY-MM-DD
  const lastDate = new Date(endDate.toISOString().split('T')[0]);

  while (currentDate <= lastDate) {
    dates.push(currentDate.toISOString().split('T')[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates;
};

export default function AdminChartsPage() {
  const { t, i18n } = useTranslation(['admin', 'claim', 'claimcreationform']);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const allClaimTypesFromContext = useClaimTypes();
  const clientPublicId = process.env.NEXT_PUBLIC_CLIENT_PUBLIC_ID;

  const getClaimTypeName = useMemo(
    () => (typeId: number) => {
      const typeObj = allClaimTypesFromContext.find((ct) => ct.id === typeId);
      return typeObj
        ? i18n.language === 'es'
          ? typeObj.categoryEs
          : typeObj.categoryEn
        : t('admin:unknown');
    },
    [allClaimTypesFromContext, i18n.language, t]
  );

  const processClaimTypes = (claims: ClaimWithMultimediaResponse[]) => {
    const counts: { [key: string]: number } = {};
    claims.forEach((c) => {
      const typeName = getClaimTypeName(c.claim.typeCategoryId);
      counts[typeName] = (counts[typeName] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  };

  const processPriorities = (claims: ClaimWithMultimediaResponse[]) => {
    const counts: { [key: string]: number } = {};
    const priorityMap = {
      [PriorityEnum.LOW]: t('claimcreationform:priority.LOW', 'Baja'),
      [PriorityEnum.MEDIUM]: t('claimcreationform:priority.MEDIUM', 'Media'),
      [PriorityEnum.HIGH]: t('claimcreationform:priority.HIGH', 'Alta'),
    };
    claims.forEach((c) => {
      const priorityName = priorityMap[c.claim.priority] || c.claim.priority;
      counts[priorityName] = (counts[priorityName] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  };

  const processTotals = (claims: ClaimWithMultimediaResponse[]) => ({
    total: claims.length,
    inProgress: claims.filter((c) => c.claim.status === ClaimStatusEnum.Open)
      .length,
    critical: claims.filter((c) => c.claim.priority === PriorityEnum.HIGH)
      .length,
  });

  const processStatuses = (claims: ClaimWithMultimediaResponse[]) => {
    const counts: { [key: string]: number } = {};
    const statusOrder = [ClaimStatusEnum.Open, ClaimStatusEnum.Close];
    const statusMap = {
      [ClaimStatusEnum.Open]: t('claim:status.Open', 'Abierto'),
      [ClaimStatusEnum.Close]: t('claim:status.Close', 'Cerrado'),
    };
    statusOrder.forEach((status) => {
      counts[statusMap[status]] = 0;
    });
    claims.forEach((c) => {
      const statusName = statusMap[c.claim.status] || c.claim.status;
      if (counts.hasOwnProperty(statusName)) {
        counts[statusName]++;
      }
    });
    const xAxis = Object.keys(counts);
    const series = Object.values(counts);
    return { xAxis, series };
  };

  const processTimelineData = (claims: ClaimWithMultimediaResponse[]) => {
    if (claims.length === 0) {
      return { xAxis: [], series: [], legend: [] };
    }

    // Order claims by date
    claims.sort(
      (a, b) =>
        new Date(a.claim.createdAt).getTime() -
        new Date(b.claim.createdAt).getTime()
    );

    const startDate = new Date(claims[0].claim.createdAt);
    const endDate = new Date(claims[claims.length - 1].claim.createdAt);
    const dateRange = getDatesInRange(startDate, endDate);

    const typesMap: { [typeName: string]: { [date: string]: number } } = {};
    const legendData: string[] = [];

    claims.forEach((c) => {
      const typeName = getClaimTypeName(c.claim.typeCategoryId);
      const claimDate = new Date(c.claim.createdAt).toISOString().split('T')[0];

      if (!typesMap[typeName]) {
        typesMap[typeName] = {};
        legendData.push(typeName);
      }
      typesMap[typeName][claimDate] = (typesMap[typeName][claimDate] || 0) + 1;
    });

    const seriesData: echarts.LineSeriesOption[] = legendData.map(
      (typeName) => {
        let cumulativeCount = 0;
        const dataPoints: number[] = dateRange.map((date) => {
          cumulativeCount += typesMap[typeName][date] || 0;
          return cumulativeCount;
        });

        return {
          name: typeName,
          type: 'line',
          stack: 'Total',
          areaStyle: {},
          emphasis: { focus: 'series' },
          data: dataPoints,
          smooth: true,
        };
      }
    );

    return { xAxis: dateRange, series: seriesData, legend: legendData };
  };

  useEffect(() => {
    const loadChartData = async () => {
      setIsLoading(true);
      setError(null);
      if (!clientPublicId) {
        setError(t('admin:missingClientPublicIdConfig'));
        setIsLoading(false);
        return;
      }

      try {
        const claims = await fetchAllClaimsByClientId(clientPublicId);

        if (!claims || claims.length === 0) {
          setChartData({
            pieClaimTypes: [],
            piePriorities: [],
            totals: { total: 0, inProgress: 0, critical: 0 },
            barStatuses: { xAxis: [], series: [] },
            timeline: { xAxis: [], series: [], legend: [] },
          });
          setIsLoading(false);
          return;
        }

        setChartData({
          pieClaimTypes: processClaimTypes(claims),
          piePriorities: processPriorities(claims),
          totals: processTotals(claims),
          barStatuses: processStatuses(claims),
          timeline: processTimelineData(claims),
        });
      } catch (err: any) {
        console.error('Error fetching or processing chart data:', err);
        setError(
          err.message ||
            t(
              'admin:errorFetchingClaims',
              'Error al obtener los reclamos para los gráficos.'
            )
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (allClaimTypesFromContext.length > 0) {
      loadChartData();
    }
  }, [clientPublicId, allClaimTypesFromContext, i18n.language, t]); // Reload if the language or type changes.

  // If it is loading, display LoadingScreen
  if (isLoading) {
    return <LoadingScreen />;
  }

  // If there is an error but no data, displays ErrorPage
  if (error && !chartData?.totals.total) {
    return <ErrorPage message={error} />;
  }

  return (
    <div className="flex flex-col bg-RCColors-900 h-full">
      <h1 className="text-2xl font-semibold text-RCColors-50 shrink-0 mb-5">
        {t('admin:graphs.title', 'Tablero de control de reclamos')}
      </h1>

      {!chartData || chartData.totals.total === 0 ? (
        <div className="h-full flex flex-col items-center justify-center bg-RCColors-800 rounded-lg p-8 text-center">
          <FaChartLine className="w-16 h-16 text-RCColors-600 mb-4" />
          <h2 className="text-2xl font-semibold mb-3 text-RCColors-200">
            {t('admin:noClaimsFoundTitle', 'Aún no hay reclamos')}
          </h2>
          <p className="text-lg">
            {t(
              'admin:noClaimsFound',
              'No hay datos suficientes para mostrar los gráficos en este momento.'
            )}
          </p>
        </div>
      ) : (
        <div className="space-y-8 pb-4">
          {/* Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Column 1: PieChart Types */}
            <div className="bg-RCColors-800 p-4 rounded-lg shadow-lg md:col-span-1 min-h-[380px] flex items-center justify-center">
              <PieChartComponent
                title={t('admin:graphs.type', 'Tipos de reclamo')}
                data={chartData.pieClaimTypes}
              />
            </div>
            {/* Column 2: PieChart Priority */}
            <div className="bg-RCColors-800 p-4 rounded-lg shadow-lg md:col-span-1 min-h-[380px] flex items-center justify-center">
              <PieChartComponent
                title={t('admin:graphs.priority', 'Prioridad')}
                data={chartData.piePriorities}
              />
            </div>
            {/* Column 3: KeyValues */}
            <div className="md:col-span-1 flex flex-col space-y-6 justify-around min-h-[380px]">
              <KeyValueDisplay
                title={t('admin:graphs.totalClaims', 'Total de reclamos')}
                value={chartData.totals.total}
                className="flex-1"
                // icon={<FaListAlt />}
              />
              <KeyValueDisplay
                title={t(
                  'admin:graphs.claimsWithStatusOpen',
                  'Total en progreso'
                )}
                value={chartData.totals.inProgress}
                className="flex-1"
                // icon={<FaTasks />}
              />
              <KeyValueDisplay
                title={t(
                  'admin:graphs.claimsWithStatusCritical',
                  'Total críticos'
                )}
                value={chartData.totals.critical}
                className="flex-1"
                // icon={<FaExclamationTriangle />}
              />
            </div>
          </div>

          {/* Row 2 */}
          <div className="bg-RCColors-800 p-4 rounded-lg shadow-lg">
            <BarChartComponent
              title={t('admin:graphs.status', 'Estados de los reclamos')}
              xAxisData={chartData.barStatuses.xAxis}
              seriesData={chartData.barStatuses.series}
            />
          </div>

          {/* Row 3 */}
          <div className="bg-RCColors-800 p-4 rounded-lg shadow-lg">
            <TimelineChartComponent
              title={t(
                'admin:graphs.timelineTitle',
                'Línea de tiempo acumulada por tipo de reclamo'
              )}
              xAxisData={chartData.timeline.xAxis}
              seriesData={chartData.timeline.series}
              legendData={chartData.timeline.legend}
            />
          </div>
        </div>
      )}

      {/* Error message (if present, but not due to missing data) */}
      {error && chartData && chartData.totals.total > 0 && (
        <div className="p-4 bg-red-900 border border-red-700 text-red-200 rounded-lg text-center mt-6 shrink-0">
          <p>
            <strong>{t('admin:warning', 'Advertencia:')}</strong> {error}
          </p>
        </div>
      )}
    </div>
  );
}
