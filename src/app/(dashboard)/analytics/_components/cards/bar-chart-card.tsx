"use client";
import React from "react";
import { useGetShipmentReport } from "@/features/analytics/api/shipment-analysis/use-get-shipment-report";
import { BarChartX } from "../charts/Bar-chart";

export const BarChartCard = ({ groupBy }: { groupBy: string }) => {

  const { data, isLoading, error } = useGetShipmentReport(groupBy);

  if (isLoading) return <p>Loading {groupBy}...</p>;
  if (error) return <p>Error loading {groupBy}: {error.message}</p>;

  return (
    <div>
      <BarChartX
        title={groupBy}
        data={data || []} // Pass the fetched data to the Histogram
      />
    </div>
  );
};
