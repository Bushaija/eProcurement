"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart";

interface BarChartProps {
  title: string;
  data: Array<{
    groupValue: string;
    orderCount: number;
    shipmentStatus: string;
  }>;
}

const shipmentStatusColors: Record<string, string> = {
  ORDERED: "hsl(var(--chart-1))",
  PLANNED: "hsl(var(--chart-2))",
  CANCELLED: "hsl(var(--chart-3))",
  RECEIVED: "hsl(var(--chart-4))",
  HOLD: "hsl(var(--chart-5))",
  PARTIAL_RECEIVED: "hsl(var(--chart-6))",
};

// Generate ChartConfig dynamically based on shipment statuses
const chartConfig: ChartConfig = Object.fromEntries(
  Object.entries(shipmentStatusColors).map(([status, color]) => [
    status,
    { label: status, color },
  ])
);

export function BarChartX({ title, data }: BarChartProps) {
  // Transform data for grouped bar chart
  const groupedData = Object.values(
    data.reduce((acc, item) => {
      // Ensure there's an entry for the group value
      if (!acc[item.groupValue]) {
        acc[item.groupValue] = { name: item.groupValue };
      }

      // Add the order count to the appropriate shipment status
      acc[item.groupValue][item.shipmentStatus] =
        (acc[item.groupValue][item.shipmentStatus] || 0) + item.orderCount;

      return acc;
    }, {} as Record<string, Record<string, any>>)
  );


  console.log("grd: ", groupedData)
  return (
    <Card>
      <CardHeader>
        <CardTitle>{`Purchase Orders by ${title}`}</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            width={600}
            height={400}
            data={groupedData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis />
            <Tooltip content={<ChartTooltipContent hideLabel />} />
            <Legend
              layout="horizontal"
              align="left"
              verticalAlign="top"
              wrapperStyle={{ paddingBottom: "10px" }}
            />
            {Object.keys(shipmentStatusColors).map((status) => (
              <Bar
                key={status}
                dataKey={status}
                stackId="a"
                fill={shipmentStatusColors[status]}
                name={status}
              />
            ))}
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
