"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart";

interface HistogramProps {
  title: string;
  data: Array<{ groupValue: string; totalCost: number }>;
}

const chartConfig: ChartConfig = {
  cost: {
    label: "Total Cost",
    color: "hsl(var(--chart-1))",
  },
};

export function Histogram({ title, data }: HistogramProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{`Total Cost by ${title}`}</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            width={500}
            height={300}
            data={data.map((item) => ({
              name: item.groupValue,
              cost: item.totalCost,
            }))}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis />
            <ChartTooltip
              cursor={{ fill: "rgba(0,0,0,0.1)" }}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="cost"
              fill="hsl(var(--chart-1))"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
