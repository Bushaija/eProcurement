"use client";

import { BarChartCard } from "../cards/bar-chart-card";

const ShipmentAnalysis = () => {
  const groupByOptions = [
    "plannedOrderDate",
    "allocationDepartment",
    "fundingSource",
    "plannedDeliveryDate",
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 ">
      {groupByOptions.map((group) => (
        <BarChartCard key={group} groupBy={group} />
      ))}
    </div>
  );
};

export default ShipmentAnalysis;
