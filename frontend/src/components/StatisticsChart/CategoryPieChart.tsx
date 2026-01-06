import React, { useEffect, useRef } from 'react';
import { Card, Empty, Spin } from 'antd';
import * as echarts from 'echarts';
import { CategoryData } from '@/types/statistics';
import { getCategoryLabel } from '@/types/bill';
import styles from './StatisticsChart.module.css';

interface CategoryPieChartProps {
  title: string;
  data: CategoryData[];
  loading?: boolean;
  color?: string;
}

export const CategoryPieChart: React.FC<CategoryPieChartProps> = ({
  title,
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
        trigger: 'item',
        formatter: (params: unknown) => {
          const p = params as { name: string; value: number; percent: number };
          return `${p.name}: ¥${p.value.toFixed(2)} (${p.percent}%)`;
        },
      },
      legend: {
        orient: 'vertical',
        right: '5%',
        top: 'center',
        type: 'scroll',
      },
      series: [
        {
          name: title,
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['35%', '50%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2,
          },
          label: {
            show: false,
            position: 'center',
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 20,
              fontWeight: 'bold',
            },
          },
          labelLine: {
            show: false,
          },
          data: data.map((item) => ({
            value: parseFloat(item.amount),
            name: getCategoryLabel(item.category),
          })),
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
  }, [data, title]);

  useEffect(() => {
    return () => {
      chartInstance.current?.dispose();
    };
  }, []);

  return (
    <Card title={title} className={styles.chartCard}>
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
