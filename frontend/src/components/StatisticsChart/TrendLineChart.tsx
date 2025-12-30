import React, { useEffect, useRef } from 'react';
import { Card, Empty, Spin } from 'antd';
import * as echarts from 'echarts';
import { TrendData } from '@/types/statistics';
import styles from './StatisticsChart.module.css';

interface TrendLineChartProps {
  data: TrendData[];
  loading?: boolean;
}

export const TrendLineChart: React.FC<TrendLineChartProps> = ({
  data,
  loading = false,
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

    const chart = chartInstance.current;

    if (data.length === 0) {
      chart.clear();
      return;
    }

    const option: echarts.EChartsOption = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      legend: {
        data: ['收入', '支出'],
        bottom: 0,
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '15%',
        top: '10%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: data.map((item) => item.date),
        axisLabel: {
          rotate: 45,
        },
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: (value: number) => `¥${value}`,
        },
      },
      series: [
        {
          name: '收入',
          type: 'line',
          smooth: true,
          data: data.map((item) => parseFloat(item.income)),
          itemStyle: {
            color: '#52c41a',
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(82, 196, 26, 0.3)' },
              { offset: 1, color: 'rgba(82, 196, 26, 0.05)' },
            ]),
          },
        },
        {
          name: '支出',
          type: 'line',
          smooth: true,
          data: data.map((item) => parseFloat(item.expense)),
          itemStyle: {
            color: '#ff4d4f',
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(255, 77, 79, 0.3)' },
              { offset: 1, color: 'rgba(255, 77, 79, 0.05)' },
            ]),
          },
        },
      ],
    };

    chart.setOption(option);

    const handleResize = () => {
      chart.resize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [data]);

  useEffect(() => {
    return () => {
      chartInstance.current?.dispose();
    };
  }, []);

  return (
    <Card title="收支趋势" className={styles.chartCard}>
      {loading ? (
        <div className={styles.loading}>
          <Spin />
        </div>
      ) : data.length === 0 ? (
        <Empty description="暂无数据" />
      ) : (
        <div ref={chartRef} className={styles.chart} />
      )}
    </Card>
  );
};
