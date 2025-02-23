"use client"
import { ChartConfig } from '@/components/ui/chart';
import { useGetFullData } from '@/features/analytics/api/use-get-full-data';
import { BarGraph } from '@/features/analytics/components/bar-graph';
import { transformDivisionCostData } from '@/lib/utils';

const chartConfig = {
  desktop: { label: "Desktop", color: "#B57EDC" },
} satisfies ChartConfig;

const chartDataX = [
  { division: "RIDS", delayedItems: 186 },
  { division: "HIV", delayedItems: 305, },
  { division: "TB", delayedItems: 237, },
  { division: "TB", delayedItems: 237, },
  { division: "TB", delayedItems: 237, },
  { division: "TB", delayedItems: 237, },
  { division: "TB", delayedItems: 237, },
];


export default function BarStats() {
    const { data, isLoading, isError } = useGetFullData();
    const chartData = transformDivisionCostData(data?.shipments ?? []);
    

    return <BarGraph 
            title={"Delayed shipments by Division"}
            data={chartDataX}
            config={chartConfig}
            xKey="delayedItems"
            yKey="division" 
          />;
}
