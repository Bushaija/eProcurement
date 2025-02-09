"use client"

import { TrendingUp } from "lucide-react"
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts"
import { message, Skeleton } from "antd";


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
import { useMergedPurchaseData } from "@/hooks/use-merge-items-data";
import { useTableColumns } from "@/hooks/use-get-table-columns";
import { aggregateByKey, transformAggregatedData } from "@/lib/utils";

const selectedColumns = [
  "itemType",
  "totalCost",
]

const chartConfig = {
  medical: {
    label: "Medical",
    color: "#2563EB",
  },
  non_medical: {
    label: "Non-Medical",
    color: "#60A8FB",
  },
} satisfies ChartConfig


export function RadialChart() {
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
    
    const aggregatedData = aggregateByKey(filteredData, "itemType", "totalCost");
    
    const totalItems = filteredData[0].totalCost + filteredData[1].totalCost + filteredData[2].totalCost;
    
    const transformedData = transformAggregatedData(aggregatedData, "itemType", "totalCost")
    console.log("filtered data: x", transformedData);

  return (
    <Card className="flex flex-col border-none">
      <CardHeader className="items-center pb-0">
        <CardTitle>Cost by Item Type</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 items-center pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[250px]"
        >
          <RadialBarChart
            data={[transformedData]}
            endAngle={180}
            innerRadius={80}
            outerRadius={130}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) - 16}
                          className="fill-foreground text-2xl font-bold"
                        >
                          {totalItems.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 4}
                          className="fill-muted-foreground"
                        >
                          Total Cost
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </PolarRadiusAxis>
            <RadialBar
              strokeWidth={10}
              dataKey="nonMedical"
              stackId="a"
              cornerRadius={5}
              fill="#2563EB"
              className="stroke-transparentk stroke-2"
            />
            <RadialBar
              strokeWidth={10}

              dataKey="medical"
              fill="#60A8FB"
              stackId="a"
              cornerRadius={5}
              className="stroke-transparentk stroke-2"
            />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      {/* <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter> */}
    </Card>
  )
}
