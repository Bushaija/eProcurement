'use client';

import { Card as MainCard } from '@/components/ui/card';
import { Card, CardProps } from '@tremor/react';
import { ReactNode } from 'react';
import { Box } from 'lucide-react';

function classNames(...classes: string[]): string {
  return classes.filter(Boolean).join(' ');
}

export type KpiItemChangeType = 'positive' | 'negative' | 'neutral';

export interface KpiItem {
  id: string;
  name: string;
  count: number;
  change?: string;
  changeType?: KpiItemChangeType;
  customIcon?: ReactNode;
  comparisonText?: string;
  iconColor?: string;
}

export interface KpiCardProps {
  data: KpiItem[];
  title?: string;
  columns?: {
    sm?: number;
    md?: number;
    lg?: number;
  };
  cardProps?: CardProps;
  hideChange?: boolean;
  positiveColor?: string;
  negativeColor?: string;
  neutralColor?: string;
  comparisonLabel?: string;
//   iconColor?: string;
}

export function KpiCard({
  data,
  title,
  columns = {
    sm: 2,
    lg: 3,
  },
  cardProps,
  hideChange = false,
  positiveColor = 'text-emerald-700 dark:text-emerald-500',
  negativeColor = 'text-red-700 dark:text-red-500',
  neutralColor = 'text-gray-700 dark:text-gray-500',
  comparisonLabel = 'from previous month',
//   iconColor = '#9835FF',
}: KpiCardProps) {
  const getColorByChangeType = (changeType?: KpiItemChangeType) => {
    if (!changeType) return neutralColor;
    switch (changeType) {
      case 'positive':
        return positiveColor;
      case 'negative':
        return negativeColor;
      case 'neutral':
      default:
        return neutralColor;
    }
  };

  return (
    <section className='flex flex-col gap-2 m-2'>
      {title && <h2 className="text-lg font-medium mb-4">{title}</h2>}
      <div className={`grid sm:grid-cols-2 gap-2`}>
        {data.map((item) => (
          <MainCard key={item.id}  className='border-[1px] border-gray-200 p-2 w-[280px] rounded-lg shadow-xs gap-2 py-8'>
            <div className='flex items-center gap-2'>
                <div className={`border-[1px] rounded-sm p-[4px]`}>
                    <Box className={``}/>
                </div>
                <p className='text-regular font-medium'>{item.name}</p>
            </div>
            <dd className="flex items-baseline ">
              <p className="text-xl font-semibold">
                # {item.count}
              </p>
            </dd>
            {!hideChange && item.change && (
              <dd className="flex items-center space-x-2 ">
                
                {item.comparisonText ? (
                  <p className="text-tremor-default">
                    {item.comparisonText}
                  </p>
                ) : comparisonLabel ? (
                  <p className="text-sm text-gray-500">
                    {comparisonLabel}
                  </p>
                ) : null}

                <p className="flex items-center space-x-0.5">
                  <span
                    className={classNames(
                      getColorByChangeType(item.changeType),
                      'text-tremor-default font-medium',
                    )}
                  >
                    {item.change}
                  </span>
                </p>
              </dd>
            )}
          </MainCard>
        ))}
      </div>
    </section>
  );
}
