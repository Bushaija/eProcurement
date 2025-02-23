import { Skeleton } from '@/components/ui/skeleton';
import { RecentSalesSkeleton } from '@/features/analytics/components/recent-sales-skeleton';
import React from 'react';

export default function Loading() {
  return <RecentSalesSkeleton />;
}
