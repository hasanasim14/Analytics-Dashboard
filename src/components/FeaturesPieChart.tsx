"use client";

import { useEffect, useState } from "react";
import { Info } from "lucide-react";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { DateRange } from "@/lib/types";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

interface FeaturesData {
  "Track & Trace": number;
  Information: number;
  Tarrif: number;
  "Information - Express Center": number;
  QSR: number;
  "Information - Cities": number;
  "Complain - Track": number;
  "Complain - New": number;
  Email: number;
}

interface ApiResponse {
  data: FeaturesData;
  success: boolean;
  message: string;
}

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

const FeaturesPieChart = ({ startDate, endDate }: DateRange) => {
  const [featuresData, setFeaturesData] = useState<FeaturesData | null>(null);

  useEffect(() => {
    const fetchPieChartData = async () => {
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
          setFeaturesData(responseData.data);
        } else {
          throw new Error(
            responseData.message || "Failed to load feature data"
          );
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to fetch data";
        console.error("Error fetching feature data:", errorMessage);
      }
    };

    fetchPieChartData();
  }, [startDate, endDate]);

  const featureOrder: (keyof FeaturesData)[] = [
    "Complain - Track",
    "Complain - New",
    "Tarrif",
    "Track & Trace",
    "Information - Cities",
    "Information - Express Center",
    "Information",
    "QSR",
    "Email",
  ];

  // Mapping into shorter names
  const featureLabels: Record<keyof FeaturesData, string> = {
    "Track & Trace": "T&T",
    Information: "Info",
    Tarrif: "Tf",
    "Complain - New": "Comp - N",
    QSR: "Q",
    "Information - Express Center": "Info - EXC",
    "Information - Cities": "Info - C",
    "Complain - Track": "Comp - T",
    Email: "E",
  };

  // New transformed data
  const transformedData = featuresData
    ? featureOrder.map((key) => ({
        feature: featureLabels[key],
        value: featuresData[key],
      }))
    : [];

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between w-full">
          <CardTitle className="font-mono uppercase text-center text-lg">
            Features usage
          </CardTitle>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon">
                <Info className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent
              side="bottom"
              className="w-84 p-4 shadow-lg rounded-lg"
            >
              <div className="text-sm font-semibold text-gray-400 mb-2 font-mono">
                Feature Breakdown
              </div>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-200 font-mono">
                <li>
                  <span className="font-medium">T&T</span> - Track & Trace
                </li>
                <li>
                  <span className="font-medium">Info</span> - Information
                </li>
                <li>
                  <span className="font-medium">Tf</span> - Tarrif
                </li>
                <li>
                  <span className="font-medium">Q</span> - QSR
                </li>
                <li>
                  <span className="font-medium">Info - EXC</span> - Information
                  - Express Center
                </li>
                <li>
                  <span className="font-medium">Info - C</span> - Information -
                  Cities
                </li>
                <li>
                  <span className="font-medium">Comp - T</span> - Complain -
                  Track
                </li>
                <li>
                  <span className="font-medium">Comp - N</span> - Complain - New
                </li>
                <li>
                  <span className="font-medium">E</span> - Email
                </li>
              </ul>
            </TooltipContent>
          </Tooltip>
        </div>
      </CardHeader>

      <CardContent className="pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px] font-mono"
        >
          <RadarChart data={transformedData}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <PolarAngleAxis dataKey="feature" />
            <PolarGrid />
            <Radar
              dataKey="value"
              fill="var(--color-desktop)"
              fillOpacity={0.6}
              stroke="var(--color-desktop)"
              dot={{ r: 4, fillOpacity: 1 }}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default FeaturesPieChart;
