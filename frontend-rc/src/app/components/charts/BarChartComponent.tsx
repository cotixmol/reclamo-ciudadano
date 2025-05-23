'use client';

import React from 'react';
import ReactECharts from 'echarts-for-react';
import { EChartsOption } from 'echarts';

interface BarChartProps {
  title: string;
  xAxisData: string[];
  seriesData: number[];
  style?: React.CSSProperties;
}

interface TooltipParams {
  marker: string;
  name: string;
  value: number;
  seriesName: string;
  dataIndex: number;
}

const barColors = ['#E4047D', '#6B7280'];

const BarChartComponent: React.FC<BarChartProps> = ({
  title,
  xAxisData,
  seriesData,
  style,
}) => {
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
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      formatter: (params: any) => {
        if (params && params.length > 0) {
          const p = params[0] as TooltipParams;
          // Get the color based on the data index
          const color = barColors[p.dataIndex % barColors.length];
          const marker = `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${color};"></span>`;
          return `${marker} ${p.name}&nbsp;&nbsp;&nbsp;&nbsp;<strong>${p.value}</strong>`;
        }
        return '';
      },
      backgroundColor: '#1F2937',
      borderColor: '#374151',
      textStyle: {
        color: '#E5E7EB',
      },
    },
    xAxis: {
      type: 'category',
      data: xAxisData,
      axisLabel: {
        color: '#9CA3AF',
        interval: 0,
        rotate: 0,
      },
      axisTick: {
        alignWithLabel: true,
        lineStyle: {
          color: '#4B5563',
        },
      },
      axisLine: {
        lineStyle: {
          color: '#4B5563',
        },
      },
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        color: '#9CA3AF',
      },
      splitLine: {
        lineStyle: {
          color: '#374151',
        },
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: '#4B5563',
        },
      },
    },
    series: [
      {
        name: title,
        type: 'bar',
        data: seriesData,
        barWidth: '50%',
        itemStyle: {
          borderRadius: [5, 5, 0, 0],
          color: (params: any) => {
            return barColors[params.dataIndex % barColors.length];
          },
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
    grid: {
      left: '3%',
      right: '4%',
      bottom: '10%',
      containLabel: true,
    },
    backgroundColor: 'transparent',
  };

  return (
    <ReactECharts
      option={option}
      style={style || { height: '400px', width: '100%' }}
      notMerge={true}
      lazyUpdate={true}
      theme="dark"
    />
  );
};

export default BarChartComponent;
