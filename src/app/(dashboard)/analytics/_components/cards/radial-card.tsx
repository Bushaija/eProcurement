"use client"
import { useGetPercentagePlannedByShipmentStatus } from '@/features/analytics/api/execution-status-analysis/use-get-percentage-planned-by-shipment-status';
import React from 'react'
import { RadialChart } from '../charts/RadialChart';
import { toTitleCase } from '@/lib/utils';

export const StatusCard = ({ status }: { status: string }) => {
  const { data, isLoading, error } = useGetPercentagePlannedByShipmentStatus(status);

  if (isLoading) return <p>Loading {status}...</p>;
  if (error) return <p>Error loading {status}: {error.message}</p>;
  return (
    // <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
    // {totalPlanned: 7, totalReceived: 0, receivedPercentage: 0}
      <div>
        <RadialChart
            // title="Ordered vs Planned"
            title={`${status} vs Planned`}
            percentage={Number(data?.percentage)}
            data={data || []}
            // dataKey={"Total Planned"}
            // dataKey={`Total ${toTitleCase(status)}`}
        />
    </div>
  );
}
