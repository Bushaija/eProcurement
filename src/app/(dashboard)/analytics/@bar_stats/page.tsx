"use client"
import { ChartConfig } from '@/components/ui/chart';
import { useGetFullData } from '@/features/analytics/api/use-get-full-data';
import { BarGraph } from '@/features/analytics/components/bar-graph';
import { transformDivisionCostData } from '@/lib/utils';

const chartConfig = {
  desktop: { label: "Desktop", color: "#DBB6ED" },
  mobile: { label: "Mobile", color: "hsl(var(--chart-2))" },
  label: { color: "hsl(var(--background))" },
} satisfies ChartConfig;

const chartDataX = [
  { division: "HIV/AIDS", totalCost: 54, },
  { division: "MCCH", totalCost: 34 },
  { division: "MTD", totalCost: 27, },
  { division: "NCDs", totalCost: 12, },
  { division: "NCDs", totalCost: 14, },
  { division: "NRL", totalCost: 8, },
  { division: "TB", totalCost: 5, },

];


export default function BarStats() {
    const { data, isLoading, isError } = useGetFullData();
    const chartData = transformDivisionCostData(data?.shipments ?? []);
    

    return <BarGraph 
            title={"Delay shipments by Division"}
            data={chartDataX}
            config={chartConfig}
            xKey="totalCost"
            yKey="division" 
          />;
}
