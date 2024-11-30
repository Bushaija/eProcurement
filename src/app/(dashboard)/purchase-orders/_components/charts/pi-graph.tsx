'use client';

import * as React from 'react';
import { TrendingUp } from 'lucide-react';
import { Label, Pie, PieChart } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
const chartData = [
  { organization: 'usaid', funders: 275, fill: '#2DBE80' },
  { organization: 'unfra', funders: 120, fill: '#E16A9E' },
  { organization: 'goverment', funders: 87, fill: '#39A5F6' },
  { organization: 'mpi', funders: 153, fill: '#FF9C2E' },
  { organization: 'tbd', funders: 50, fill: '#8B6AE7' }
];

const chartConfig = {
  funders: {
    label: 'Visitors'
  },
  usaid: {
    label: 'USAID',
    color: 'hsl(var(--chart-1))'
  },
  unfra: {
    label: 'UNFRA',
    color: 'hsl(var(--chart-2))'
  },
  goverment: {
    label: 'Goverment',
    color: 'hsl(var(--chart-3))'
  },
  mpi: {
    label: 'MPI',
    color: 'hsl(var(--chart-4))'
  },
  tbd: {
    label: 'TBD',
    color: 'hsl(var(--chart-5))'
  }
} satisfies ChartConfig;

export function PieGraph() {
  const totalVisitors = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.funders, 0);
  }, []);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Purchase Orders by Funders</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[360px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="funders"
              nameKey="organization"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className=" text-3xl font-bold text-[#8B6AE7]"
                        >
                          {totalVisitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Funders
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total Funders for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}
