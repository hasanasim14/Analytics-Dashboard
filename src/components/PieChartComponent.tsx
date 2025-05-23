"use client";

import { Pie, PieChart, Cell } from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const COLORS = {
  used: "#e05d44", // Red for used budget
  unused: "#e8f5e9", // Light green for remaining
};

export function PieChartComponent() {
  const usedBudget = 47.74;
  const totalBudget = 500;
  const remainingBudget = totalBudget - usedBudget;

  // Calculate percentages
  const usedPercentage = (usedBudget / totalBudget) * 100;
  const remainingPercentage = 100 - usedPercentage;

  const chartData = [
    { name: "used", value: usedBudget, percentage: usedPercentage },
    { name: "unused", value: remainingBudget, percentage: remainingPercentage },
  ];

  const chartConfig = {
    used: {
      label: "Used",
      color: COLORS.used,
    },
    unused: {
      label: "Remaining",
      color: COLORS.unused,
    },
  } satisfies ChartConfig;

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>
          Budget Usage: Pkr {usedBudget} of Pkr {totalBudget}
        </CardTitle>
        <CardDescription className="sr-only">
          Budget usage pie chart visualization
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[entry.name as keyof typeof COLORS]}
                />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>

        <div className="mt-4 flex justify-center space-x-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-[#e05d44] rounded-full mr-2"></div>
            <span className="text-sm">Used: {usedPercentage.toFixed(1)}%</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-[#e8f5e9] rounded-full mr-2"></div>
            <span className="text-sm">
              Remaining: {remainingPercentage.toFixed(1)}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
