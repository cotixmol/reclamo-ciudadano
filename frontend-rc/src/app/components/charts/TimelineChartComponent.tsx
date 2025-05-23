'use client';

import React from 'react';
import ReactECharts from 'echarts-for-react';
import { EChartsOption } from 'echarts';

interface TimelineChartProps {
  title: string;
  xAxisData: string[];
  seriesData: echarts.LineSeriesOption[];
  legendData: string[];
  style?: React.CSSProperties;
}

const TimelineChartComponent: React.FC<TimelineChartProps> = ({
  title,
  xAxisData,
  seriesData,
  legendData,
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
        type: 'cross',
        label: {
          backgroundColor: '#6a7985',
        },
      },
      backgroundColor: '#1F2937',
      borderColor: '#374151',
      textStyle: {
        color: '#E5E7EB',
      },
    },
    legend: {
      data: legendData,
      bottom: 10,
      textStyle: {
        color: '#9CA3AF',
      },
      inactiveColor: '#4B5563',
      type: 'scroll',
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      containLabel: true,
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: xAxisData,
        axisLabel: {
          color: '#9CA3AF',
        },
      },
    ],
    yAxis: [
      {
        type: 'value',
        axisLabel: {
          color: '#9CA3AF',
        },
        splitLine: {
          lineStyle: {
            color: '#374151',
          },
        },
      },
    ],
    series: seriesData,
    dataZoom: [
      {
        type: 'slider',
        start: 0,
        end: 100,
        bottom: 45,
        height: 20,
        textStyle: {
          color: '#9CA3AF',
        },
      },
      {
        type: 'inside',
        start: 0,
        end: 100,
      },
    ],
    backgroundColor: 'transparent',
    // color: ['#E4047D', '#34D399', '#60A5FA', '#FBBF24', '#A78BFA', '#F87171', ... ]
  };

  return (
    <ReactECharts
      option={option}
      style={style || { height: '500px', width: '100%' }}
      notMerge={true}
      lazyUpdate={true}
      theme="dark"
    />
  );
};

export default TimelineChartComponent;
