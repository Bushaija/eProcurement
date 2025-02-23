import { BarChart, Bar, CartesianGrid, XAxis, YAxis, LabelList } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { cn } from "@/lib/utils";

type BarGraphProps = {
  data: Record<string, any>[];
  config: ChartConfig;
  title: string;
  description?: string;
  xKey: string;
  yKey: string;
};

export function BarGraph({ data, config, title, description, xKey, yKey }: BarGraphProps) {
    return (
        <Card className={cn("h-full")}>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={config} >
                  <BarChart
                      accessibilityLayer
                      data={data}
                      layout="vertical"
                      margin={{ right: 16 }}
                      width={600} // width of the graph
                      height={400} // height of the graph
                  >
                    <CartesianGrid horizontal={false}/>
                    <YAxis 
                      dataKey={yKey} 
                      type="category" 
                      tickLine={false} 
                      tickMargin={10}
                      axisLine={false} 

                      // tickFormatter={()}  
                      hide
                    />
                    
                    <XAxis dataKey={xKey} type="number" hide
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                    />

                    <ChartTooltip 
                      cursor={false}
                      content={<ChartTooltipContent indicator="line" />}
                    />

                    <Bar
                      dataKey={xKey}
                      layout="vertical"
                      fill="var(--color-desktop)"
                      radius={2}
                      barSize={20}
                    >
                      <LabelList
                        dataKey={yKey}
                        position="insideLeft"
                        offset={8}
                        className="fill-[--color-label]"
                        fontSize={12}
                      />
                      <LabelList
                        dataKey={xKey}
                        position="right"
                        offset={8}
                        className="fill-foreground"
                        fontSize={12}
                      />
                    </Bar>
                  </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
