'use client';

import React from 'react';
import ReactECharts from 'echarts-for-react';
import { EChartsOption } from 'echarts';

interface PieChartProps {
  title: string;
  data: Array<{ value: number; name: string }>;
  style?: React.CSSProperties;
}

interface TooltipParams {
  marker: string;
  name: string;
  value: number;
  percent: number;
}

const PieChartComponent: React.FC<PieChartProps> = ({ title, data, style }) => {
  const option: EChartsOption = {
    title: {
      text: title,
      left: 'center',
      top: 10,
      textStyle: {
        color: '#9CA3AF',
        fontSize: 20,
        fontWeight: 500,
      },
    },
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        const { marker, name, value, percent } = params as TooltipParams;
        return `${marker} ${name}&nbsp;&nbsp;&nbsp;&nbsp;<strong>${value}</strong> (${percent}%)`;
      },
      backgroundColor: '#1F2937',
      borderColor: '#374151',
      textStyle: {
        color: '#E5E7EB',
      },
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      top: 'middle',
      textStyle: {
        color: '#9CA3AF',
      },
      inactiveColor: '#4B5563',
    },
    series: [
      {
        name: title,
        type: 'pie',
        radius: '50%',
        center: ['55%', '55%'],
        data: data,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
        label: {
          show: false,
        },
        labelLine: {
          show: false,
        },
      },
    ],
    backgroundColor: 'transparent',
    color: ['#E4047D', '#34D399', '#60A5FA', '#FBBF24', '#A78BFA', '#F87171'],
  };

  return (
    <ReactECharts
      option={option}
      style={style || { height: '350px', width: '100%' }}
      notMerge={true}
      lazyUpdate={true}
      theme="dark"
    />
  );
};

export default PieChartComponent;
