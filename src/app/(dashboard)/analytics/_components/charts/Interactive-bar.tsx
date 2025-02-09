"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { message, Skeleton } from "antd"

import {
  Card,
  CardContent,
  CardDescription,
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
import { transformDeliveryDates } from "@/lib/utils"


const chartConfig = {
  views: {
    label: "Item Quantity",
  },
  medical: {
    label: "Medical",
    color: "hsl(var(--chart-1))",
  },
  "non-medical": { // Change the key to match the dataset
    label: "Non-Medical",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;


const selectedColumns = [
    "itemType",
    "plannedQuantity",
    "plannedDeliveryDate",
];

export function InteractiveBarChart() {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("medical")
    const [activeYear, setActiveYear] = React.useState<string|null>(null);
    const [messageApi, contextHolder] = message.useMessage(); 
    const {
        data: filteredData,
        isLoading,
        error,
    } = useMergedPurchaseData(selectedColumns);
    
    console.log("filtered data: ", filteredData);

    const total = React.useMemo(
        () => ({
          medical: filteredData
            .filter((item) => item.itemType === "medical")
            .reduce((acc, curr) => acc + curr.plannedQuantity, 0),
    
          "non-medical": filteredData // Change key to match chartConfig
            .filter((item) => item.itemType === "non-medical")
            .reduce((acc, curr) => acc + curr.plannedQuantity, 0),
        }),
        [filteredData]
    );
    
      

    if (isLoading) {
        return <Skeleton className="py-5 px-5 max-sm:px-0" active paragraph={{ rows: 6}} />;
    }
  
    if (error) {
        messageApi.open({
            type: "error",
            content: "Error fetching data",
        });
    }

    const transformedData = transformDeliveryDates(filteredData, "plannedDeliveryDate")
    const uniqueYears = [...new Set(transformedData.map((item) => item.plannedDeliveryDate.split("-")[1]))];
    
    const filteredData_ = activeYear ? transformedData.filter((item) => item.plannedDeliveryDate.endsWith(activeYear)) : transformedData;

    const transformedData_ = transformData(filteredData_);
    console.log(transformedData);




  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Planned Deliveries by Month</CardTitle>
        </div>
        <div className="flex">
          {["medical", "non-medical"].map((key) => {
            const chart = key as keyof typeof chartConfig
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-xs text-muted-foreground">
                {chartConfig[chart]?.label ?? "Unknown"}
                </span>
                <span className="text-lg font-bold leading-none sm:text-3xl">
                {total[chart]?.toLocaleString() ?? "0"}
                </span>
              </button>
            )
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={transformedData_}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="plannedDeliveryDate"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  }}
                />
              }
            />
            <Bar dataKey={activeChart} fill={"#235FE2"} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

const transformData = (data) => {
    return Object.values(
      data.reduce((acc, item) => {
        const { plannedDeliveryDate, itemType, plannedQuantity } = item;
  
        if (!acc[plannedDeliveryDate]) {
          acc[plannedDeliveryDate] = {
            plannedDeliveryDate,
            medical: 0,
            "non-medical": 0,
          };
        }
  
        if (itemType === "medical") {
          acc[plannedDeliveryDate].medical += plannedQuantity || 0;
        } else if (itemType === "non-medical") {
          acc[plannedDeliveryDate]["non-medical"] += plannedQuantity || 0;
        }
  
        return acc;
      }, {})
    );
  };
  
