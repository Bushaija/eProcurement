"use client"
import { ChartConfig } from "@/components/ui/chart";
import { useGetFullData } from "@/features/analytics/api/use-get-full-data";
import { InteractivePieGraph } from "@/features/analytics/components/interactive-pie-graph";

const desktopData = [
  { month: "GOVERNMENT", desktop: 5, fill: "#4b11c7" },
  { month: "WHO", desktop: 10, fill: "#7f4ca5" },
  { month: "ENABEL", desktop: 7, fill: "#b57edc" },
  { month: "PEPFAR", desktop: 15, fill: "#dbb6ed" },
  { month: "TBD", desktop: 22, fill: "#e2cdf4" },
  { month: "PMI", desktop: 29, fill: "#fff0ff" },
]
const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  desktop: {
    label: "Desktop",
  },
  mobile: {
    label: "Mobile",
  },
  january: {
    label: "January",
    color: "hsl(var(--chart-1))",
  },
  february: {
    label: "February",
    color: "hsl(var(--chart-2))",
  },
  march: {
    label: "March",
    color: "hsl(var(--chart-3))",
  },
  april: {
    label: "April",
    color: "hsl(var(--chart-4))",
  },
  may: {
    label: "May",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

export default function Stats() {
  const { data, isLoading, isError } = useGetFullData();

  return (
    <InteractivePieGraph
      data={desktopData}
      chartConfig={chartConfig}
      countKey={"desktop"}
      nameKey={"month"}
      title="Total Cost by Funding Source" 
      description="Distribution of shipment costs based on funding sources" 
    />
  );
}
