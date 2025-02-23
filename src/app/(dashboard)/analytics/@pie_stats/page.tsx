"use client"
import { useMemo } from "react";
import { useGetFullData } from "@/features/analytics/api/use-get-full-data";
import { PieGraph } from "@/features/analytics/components/pie-graph";
import { ChartConfig } from "@/components/ui/chart";

const chartData = [
  { browser: "GOVERNMENT", visitors: 200000, fill: "#4b11c7" },
  { browser: "WHO", visitors: 5000, fill: "#7f4ca5" },
  { browser: "ENABEL", visitors: 2000000, fill: "#b57edc" },
  { browser: "PEPFAR", visitors: 5990075.99, fill: "#dbb6ed" },
  { browser: "TBD", visitors: 4000000, fill: "#e2cdf4" },
  { browser: "PMI", visitors: 1500000, fill: "#fff0ff" },
]

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "",
  },
  safari: {
    label: "Safari",
    color: "hsl(var(--chart-2))",
  },
  firefox: {
    label: "Firefox",
    color: "hsl(var(--chart-3))",
  },
  edge: {
    label: "Edge",
    color: "hsl(var(--chart-4))",
  },
  other: {
    label: "Other",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;


export default function PieChart() {
  const { data, isLoading, isError } = useGetFullData();

  // const pieChartData = useMemo(() => {
  //   if (!data) return [];

  //   const fundingMap = new Map();
  //   data.shipments.forEach((shipment) => {
  //     if (!shipment.fundingSource) return;
      
  //     if (fundingMap.has(shipment.fundingSource)) {
  //       fundingMap.set(
  //         shipment.fundingSource,
  //         fundingMap.get(shipment.fundingSource) + shipment.totalCost
  //       );
  //     } else {
  //       fundingMap.set(shipment.fundingSource, shipment.totalCost);
  //     }
  //   });

  //   // Convert to array format for the PieChart
  //   const colors = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];
    
  //   return Array.from(fundingMap.entries()).map(([name, value], index) => ({
  //     name,
  //     value,
  //     fill: colors[index % colors.length], // Assign colors dynamically
  //   }));
  // }, [data]);

  // if (isLoading) return <p>Loading...</p>;
  // if (isError) return <p>Error loading data.</p>;

  return (
    <PieGraph 
      data={chartData} 
      chartConfig={chartConfig}
      countKey={"visitors"}
      nameKey={"browser"}
      title="Total Cost by Funding Source" 
      description="Distribution of shipment costs based on funding sources" 
    />
  );
}
