"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface HorizontalBarChartProps<T> {
  title: string;
  description?: string;
  data: T[];
  xKey: keyof T; // Numeric field for X-axis
  yKey: keyof T; // Categorical field for Y-axis
  config: ChartConfig;
  footerText?: string;
  showTrending?: boolean;
}

export function HorizontalBarChart<T extends Record<string, any>>({
  title,
  description,
  data,
  xKey,
  yKey,
  config,
  footerText,
  showTrending = true,
}: HorizontalBarChartProps<T>) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ChartContainer config={config}>
          <BarChart
            accessibilityLayer
            data={data}
            layout="vertical"
            margin={{ left: -20 }}
          >
            <XAxis type="number" dataKey={xKey as string} hide />
            <YAxis
              dataKey={yKey as string}
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value: string) => value.slice(0, 3)} // Shorten labels
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            {Object.keys(config).map((key) => (
              <Bar
                key={key}
                dataKey={key}
                fill={config[key as keyof ChartConfig]?.color || "gray"}
                radius={5}
              />
            ))}
          </BarChart>
        </ChartContainer>
      </CardContent>
      {footerText && (
        <CardFooter className="flex-col items-start gap-2 text-sm">
          {showTrending && (
            <div className="flex gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
          )}
          <div className="leading-none text-muted-foreground">{footerText}</div>
        </CardFooter>
      )}
    </Card>
  );
}
