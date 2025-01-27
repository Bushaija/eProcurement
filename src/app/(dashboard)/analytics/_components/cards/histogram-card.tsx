"use client";
import React from "react";
import { Histogram } from "../charts/Histogram";
import { useGetTotalCostReport } from "@/features/analytics/api/cost-analysis/use-get-total-cost-report";

export const HistogramCard = ({ groupBy }: { groupBy: string }) => {
  const { data, isLoading, error } = useGetTotalCostReport(groupBy);

  if (isLoading) return <p>Loading {groupBy}...</p>;
  if (error) return <p>Error loading {groupBy}: {error.message}</p>;

  return (
    <div>
      <Histogram
        title={groupBy}
        data={data || []} // Pass the fetched data to the Histogram
      />
    </div>
  );
};
