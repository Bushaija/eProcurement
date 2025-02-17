"use client"

// import { TrendingUp } from "lucide-react"
import { Label, Pie, PieChart, Sector } from "recharts"
import { message, Skeleton } from "antd";
import { PieSectorDataItem } from "recharts/types/polar/Pie"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { useMergedPurchaseData } from "@/hooks/use-merge-items-data"
import { aggregateByKey } from "@/lib/utils";

const chartData = [
  { browser: "chrome", visitors: 275, fill: "#2563EB" },
  { browser: "safari", visitors: 200, fill: "#60A8FB" },
  { browser: "other", visitors: 90, fill: "#BEDCFE" },
]

const chartConfig = {
    fundingSource: { label: "Funder", color: "hsl(var(--chart-1))" },
    totalCost: { label: "Total Budget", color: "hsl(var(--chart-2))" },
};

const selectedColumns = [
    "fundingSource",
    "totalCost",
];



export function CostBySourceFund() {
    const [messageApi, contextHolder] = message.useMessage();  
    const {
        data: filteredData,
        isLoading,
        error,
    } = useMergedPurchaseData(selectedColumns);

    if (isLoading) {
        return <Skeleton className="py-5 px-5 max-sm:px-0" active paragraph={{ rows: 6}} />;
    }

    if (error) {
        messageApi.open({
            type: "error",
            content: "Error fetching data",
        });
    }
    const typedData = filteredData ;
    const aggregatedData = aggregateByKey(typedData, "fundingSource", "totalCost");

    const extendedAggregatedData = aggregatedData.map((item, index) => ({
        ...item,
        fill: chartData[index % chartData.length].fill, // Cycle through chartData colors
    }));


  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Total Cost By Source of Funds</CardTitle>
        {/* <CardDescription>January - June 2024</CardDescription> */}
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={extendedAggregatedData}
              dataKey="totalCost"
              nameKey="fundingSource"
              innerRadius={60}
              strokeWidth={5}
              activeIndex={0}
              activeShape={({
                outerRadius = 0,
                ...props
              }: PieSectorDataItem) => (
                <Sector {...props} outerRadius={outerRadius + 10} />
              )}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
