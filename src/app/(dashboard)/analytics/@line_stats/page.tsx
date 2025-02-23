"use client"
import { ChartConfig } from '@/components/ui/chart';
import { useGetFullData } from '@/features/analytics/api/use-get-full-data';
import { LineGraph } from '@/features/analytics/components/line-graph';
import { transformDivisionCostData } from '@/lib/utils';

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#4B11C7",
  },
} satisfies ChartConfig

const chartDataX = [
  { month: "July", desktop: 23,},
  { month: "August", desktop: 6,},
  { month: "September", desktop: 4,},
  { month: "October", desktop: 0,},
  { month: "Novemeber", desktop: 56,},
  { month: "December", desktop: 13,},
  { month: "January", desktop: 13,},
  { month: "February", desktop: 23,},
  { month: "March", desktop: 2,},
  { month: "April", desktop: 0,},
  { month: "May", desktop: 53,},
  { month: "June", desktop: 4,},
]


export default function BarStats() {
    const { data, isLoading, isError } = useGetFullData();
    const chartData = transformDivisionCostData(data?.shipments ?? []);
    

    return <LineGraph 
            title={"Delayed shipments by Month"}
            data={chartDataX}
            config={chartConfig}
            xKey="month"
            yKey="desktop" 
          />;
}
