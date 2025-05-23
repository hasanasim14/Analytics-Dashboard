"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { date: "2024-04-01", cost: 1200 },
  { date: "2024-04-02", cost: 900 },
  { date: "2024-04-03", cost: 1500 },
  { date: "2024-04-04", cost: 1800 },
  { date: "2024-04-05", cost: 2100 },
  { date: "2024-04-06", cost: 1900 },
  { date: "2024-04-07", cost: 1600 },
  { date: "2024-04-08", cost: 2300 },
  { date: "2024-04-09", cost: 850 },
  { date: "2024-04-10", cost: 1750 },
  { date: "2024-04-11", cost: 1950 },
  { date: "2024-04-12", cost: 1650 },
  { date: "2024-04-13", cost: 2200 },
  { date: "2024-04-14", cost: 1400 },
  { date: "2024-04-15", cost: 1250 },
  { date: "2024-04-16", cost: 1350 },
  { date: "2024-04-17", cost: 2400 },
  { date: "2024-04-18", cost: 2100 },
  { date: "2024-04-19", cost: 1600 },
  { date: "2024-04-20", cost: 950 },
  { date: "2024-04-21", cost: 1400 },
  { date: "2024-04-22", cost: 1700 },
  { date: "2024-04-23", cost: 1350 },
  { date: "2024-04-24", cost: 2050 },
  { date: "2024-04-25", cost: 1850 },
  { date: "2024-04-26", cost: 800 },
  { date: "2024-04-27", cost: 2250 },
  { date: "2024-04-28", cost: 1300 },
  { date: "2024-04-29", cost: 1950 },
  { date: "2024-04-30", cost: 2350 },
  { date: "2024-05-01", cost: 1450 },
  { date: "2024-05-02", cost: 1950 },
  { date: "2024-05-03", cost: 1750 },
  { date: "2024-05-04", cost: 2250 },
  { date: "2024-05-05", cost: 2450 },
  { date: "2024-05-06", cost: 2600 },
  { date: "2024-05-07", cost: 2050 },
  { date: "2024-05-08", cost: 1350 },
  { date: "2024-05-09", cost: 1750 },
  { date: "2024-05-10", cost: 1950 },
  { date: "2024-05-11", cost: 1850 },
  { date: "2024-05-12", cost: 1550 },
  { date: "2024-05-13", cost: 1250 },
  { date: "2024-05-14", cost: 2500 },
  { date: "2024-05-15", cost: 2450 },
  { date: "2024-05-16", cost: 2150 },
  { date: "2024-05-17", cost: 2600 },
  { date: "2024-05-18", cost: 1950 },
  { date: "2024-05-19", cost: 1550 },
  { date: "2024-05-20", cost: 1650 },
  { date: "2024-05-21", cost: 900 },
  { date: "2024-05-22", cost: 850 },
  { date: "2024-05-23", cost: 1850 },
  { date: "2024-05-24", cost: 1950 },
  { date: "2024-05-25", cost: 1650 },
  { date: "2024-05-26", cost: 1550 },
  { date: "2024-05-27", cost: 2400 },
  { date: "2024-05-28", cost: 1650 },
  { date: "2024-05-29", cost: 850 },
  { date: "2024-05-30", cost: 1950 },
  { date: "2024-05-31", cost: 1550 },
];

const chartConfig = {
  views: {
    label: "Daily Cost",
  },
  cost: {
    label: "Cost ($)",
    color: "#e05d44",
  },
} satisfies ChartConfig;

export function BarChartComponent() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("cost");

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row justify-center">
        <CardTitle className="font-medium">Total Cost by Day</CardTitle>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
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
                    });
                  }}
                />
              }
            />
            <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
