"use client";

import { HistogramCard } from "../cards/histogram-card";

const CostAnalysis = () => {
  const groupByOptions = [
    "plannedOrderDate",
    "allocationDepartment",
    "fundingSource",
    "plannedDeliveryDate",
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {groupByOptions.map((group) => (
        <HistogramCard key={group} groupBy={group} />
      ))}
    </div>
  );
};

export default CostAnalysis;
