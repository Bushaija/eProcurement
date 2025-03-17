'use client';

import React from 'react';
import { DonutChart, ConfigurableDonutChartProps } from '@/components/charts/donut-chart';
import styles from './stats.module.css';

export function DonutChartWrapper(props: ConfigurableDonutChartProps) {
  return (
    <div className={styles.donutChartContainer}>
      <DonutChart {...props} />
    </div>
  );
} 