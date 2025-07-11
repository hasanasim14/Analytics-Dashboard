"use client";

import { useEffect, useState } from "react";
import { Pie, PieChart, Cell, ResponsiveContainer } from "recharts";
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
import { DateRange } from "@/lib/types";

const COLORS = {
  used: "#e05d44",
  unused: "#e5e7eb",
};

interface BudgetData {
  TotalSpend: number;
  remainingAmount: number;
}

interface ApiResponse {
  data: BudgetData;
  success: boolean;
  message: string;
}

const FeaturesPieChart = ({ startDate, endDate }: DateRange) => {
  const [budgetData, setBudgetData] = useState<BudgetData | null>(null);

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

  useEffect(() => {
    const fetchPieChartData = async () => {
      // calculating the current month and year
      const currentDate = new Date();
      const currentMonth = `${String(currentDate.getMonth() + 1).padStart(
        2,
        "0"
      )}-${currentDate.getFullYear()}`;

      const startPeriod = startDate || currentMonth;
      const endPeriod = endDate || currentMonth;

      try {
        const url = new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/Tools`);
        url.searchParams.append("startPeriod", startPeriod);
        url.searchParams.append("endPeriod", endPeriod);

        const response = await fetch(url.toString());

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData: ApiResponse = await response.json();

        if (responseData.success) {
          setBudgetData(responseData.data);
        } else {
          throw new Error(responseData.message || "Failed to load budget data");
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to fetch data";
        console.error("Error fetching budget data:", errorMessage);
      }
    };
    fetchPieChartData();
  }, [startDate, endDate]);

  // Calculate data
  const totalBudget = budgetData
    ? budgetData.TotalSpend + budgetData.remainingAmount
    : 0;
  const usedPercentage = budgetData
    ? (budgetData.TotalSpend / totalBudget) * 100
    : 0;
  const remainingPercentage = budgetData
    ? (budgetData.remainingAmount / totalBudget) * 100
    : 0;

  const chartData = [
    {
      name: "used",
      value: budgetData?.TotalSpend || 0,
      percentage: usedPercentage,
    },
    {
      name: "unused",
      value: budgetData?.remainingAmount || 0,
      percentage: remainingPercentage,
    },
  ];

  return (
    <Card className="flex flex-col border-0 shadow-sm h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold font-mono uppercase tracking-widest text-center">
          Features Usage
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground font-mono text-center">
          PKR {budgetData?.TotalSpend?.toLocaleString() || 0} of{" "}
          {totalBudget.toLocaleString()} used
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center pt-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square h-[200px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                startAngle={90}
                endAngle={-270}
                animationDuration={800}
                animationEasing="ease-out"
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[entry.name as keyof typeof COLORS]}
                    stroke="transparent"
                  />
                ))}
              </Pie>
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    formatter={(value) => [
                      `PKR ${Number(value).toLocaleString()}`,
                      chartConfig[
                        value === chartData[0].value ? "used" : "unused"
                      ].label,
                    ]}
                  />
                }
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>

        <div className="mt-4 flex flex-wrap justify-center gap-4">
          {chartData.map((entry) => (
            <div key={entry.name} className="flex items-center">
              <div
                className="mr-2 h-3 w-3 rounded-full"
                style={{
                  backgroundColor: COLORS[entry.name as keyof typeof COLORS],
                }}
              />
              <span className="text-sm font-medium font-mono">
                {chartConfig[entry.name as keyof typeof COLORS].label}:{" "}
                {entry.percentage.toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default FeaturesPieChart;
