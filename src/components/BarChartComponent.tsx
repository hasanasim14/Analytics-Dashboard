"use client";

import * as React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  views: {
    label: "Daily Cost",
    color: "#8884d8",
  },
  cost: {
    label: "Cost ($)",
    color: "#e05d44",
  },
} satisfies ChartConfig;

interface DailyCostItem {
  index: number;
  date: string;
  cost: number;
}

interface ApiResponse {
  data: DailyCostItem[];
  success: boolean;
  message: string;
}

export function BarChartComponent() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("cost");
  const [dailyCostData, setDailyCostData] = React.useState<DailyCostItem[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchBarChartData = async () => {
      try {
        setError(null);

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/DailyCost`,
          {
            method: "GET",
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData: ApiResponse = await response.json();

        if (responseData.success && responseData.data) {
          setDailyCostData(responseData.data);
        } else {
          throw new Error(responseData.message || "Failed to load data");
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to fetch data";
        setError(errorMessage);
        console.error("Error fetching data:", error);
      }
    };

    fetchBarChartData();
  }, []);

  // Calculate bar size based on data length
  const calculateBarSize = () => {
    if (!dailyCostData.length) return 30; // default size

    // Adjust bar width based on number of data points
    const baseWidth = 30;
    const maxWidth = 50;
    const minWidth = 15;

    // Calculate width based on number of items (more items = smaller bars)
    const calculatedWidth = Math.max(
      minWidth,
      Math.min(maxWidth, baseWidth - dailyCostData.length * 0.5)
    );

    return calculatedWidth;
  };

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader className="border-b p-0">
          <CardTitle className="font-medium">Total Cost by Day</CardTitle>
        </CardHeader>
        <CardContent className="p-6 text-destructive">
          Error: {error}
        </CardContent>
      </Card>
    );
  }

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
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={dailyCostData}
              margin={{
                left: 12,
                right: 12,
                top: 12,
                bottom: 12,
              }}
              barSize={calculateBarSize()}
              barGap={4}
            >
              <CartesianGrid
                vertical={false}
                strokeDasharray="3 3"
                stroke="#f0f0f0"
              />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tick={{ fill: "#6b7280", fontSize: 12 }}
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
                    formatter={(value) => [`${value}`, " PKR"]}
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
              <Bar
                dataKey={activeChart}
                fill={chartConfig[activeChart].color}
                radius={[4, 4, 0, 0]}
                animationDuration={1500}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
