"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useMergedPurchaseData } from "@/hooks/use-merge-items-data"
import { message, Skeleton } from "antd"
import React from "react"
import { transformDeliveryDates } from "@/lib/utils"
const chartData = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

const selectedColumns = [
  "plannedQuantity",
  "plannedDeliveryDate",
];

export function PlannedDeliveryByMonth() {
  const [activeYear, setActiveYear] = React.useState<string|null>(null);
  const [messageApi, contextHolder] = message.useMessage();  

  // const activeIndex = React.useMemo(
  //   () => desktopData.findIndex((item) => item.Year === activeYear),
  //   [activeYear]
  // )
  const {
    data: filteredData,
    isLoading,
    error,
  } = useMergedPurchaseData(selectedColumns);
  const transformedData = transformDeliveryDates(filteredData, "plannedDeliveryDate")
  const uniqueYears = [...new Set(transformedData.map((item) => item.plannedDeliveryDate.split("-")[1]))];

  const filteredData_ = activeYear ? transformedData.filter((item) => item.plannedDeliveryDate.endsWith(activeYear)) : transformedData;

  if (isLoading) {
      return <Skeleton className="py-5 px-5 max-sm:px-0" active paragraph={{ rows: 6}} />;
  }

  if (error) {
      messageApi.open({
          type: "error",
          content: "Error fetching data",
      });
  }


  return (
    <Card>
      <CardHeader>
        <CardTitle>Planned Delivery by Month</CardTitle>
        {/* <CardDescription>January - June 2024</CardDescription> */}
        <Select value={activeYear || ""} onValueChange={setActiveYear}>
          <SelectTrigger
            className="ml-auto h-7 w-[130px] rounded-lg pl-2.5"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Select Year" />
          </SelectTrigger>
          <SelectContent align="end" className="rounded-xl">
          {uniqueYears.map((year) => (
            <SelectItem key={year} value={year} className="rounded-lg [&_span]:flex">
              <div className="flex items-center gap-2 text-xs">{`20${year}`}</div>
            </SelectItem>
          ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={filteredData_}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="plannedDeliveryDate"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="plannedQuantity" fill="#60A8FB" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      {/* <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter> */}
    </Card>
  )
}
