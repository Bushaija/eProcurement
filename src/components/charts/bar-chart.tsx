"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, XAxis, YAxis } from "recharts"

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
const chartData = [
  { browser: "chrome", products: 275, fill: "#248CD8" },
  { browser: "safari", products: 200, fill: "#A601FE" },
  { browser: "firefox", products: 187, fill: "#EDA145" },
  { browser: "edge", products: 173, fill: "#15B097" },
  { browser: "other", products: 90, fill: "#FF7456" },
]

const chartConfig = {
  products: {
    label: "Products",
  },
  chrome: {
    label: "Ordered",
    color: "#248CD8",
  },
  safari: {
    label: "Partially Received",
    color: "#A601FE",
  },
  firefox: {
    label: "Received",
    color: "#EDA145",
  },
  edge: {
    label: "Hold",
    color: "#15B097",
  },
  other: {
    label: "Cancelled",
    color: "#FF7456",
  },
} satisfies ChartConfig

export function StatusBarChart() {
  return (
    <div className=" w-[400px] h-full">
    <Card className="outline-none border-0 shadow-none bg-[#fff]">
      <CardHeader>
        <CardTitle className="text-[]">Shipment Status Volume</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              left: 0,
            }}
          >
            <YAxis
              dataKey="browser"
              type="category"
              tickLine={false}
              tickMargin={3}
              axisLine={false}
              tickFormatter={(value) =>
                chartConfig[value as keyof typeof chartConfig]?.label
              }
            />
            <XAxis dataKey="products" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="products" layout="vertical" radius={5}/>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Orders on hold up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total products for the last 6 months
        </div>
      </CardFooter>
    </Card>
    </div>
  )
}
