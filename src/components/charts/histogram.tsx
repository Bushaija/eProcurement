"use client"

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
const chartData = [
  { month: "January", punctual: 186, Delayed: 80 },
  { month: "February", punctual: 305, Delayed: 200 },
  { month: "March", punctual: 237, Delayed: 120 },
  { month: "April", punctual: 73, Delayed: 190 },
  { month: "May", punctual: 209, Delayed: 130 },
  { month: "June", punctual: 214, Delayed: 140 },
  { month: "July", punctual: 180, Delayed: 140 },
  { month: "August", punctual: 260, Delayed: 220 },
  { month: "September", punctual: 90, Delayed: 140 },
  { month: "October", punctual: 214, Delayed: 250 },
]

const chartConfig = {
  punctual: {
    label: "Punctual",
    color: "#248cd8",
  },
  Delayed: {
    label: "Delayed",
    color: "a601ff",
  },
} satisfies ChartConfig

export function DelaysBarChart() {
  return (
    <section className="w-[950px] h-[250px]">
    <Card className="outline-none border-0 shadow-none bg-[#fff]">
      <CardHeader>
        <CardTitle>Shipment Delays</CardTitle>
        <CardDescription>January - October 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[150px] w-[950px]">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={5}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="punctual" fill="var(--color-punctual)" radius={4} />
            <Bar dataKey="Delayed" fill="var(--color-Delayed)" radius={4} />
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
    </section>
  )
}
