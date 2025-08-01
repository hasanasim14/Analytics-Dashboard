"use client";

import { useState } from "react";
import { PieChartComponent } from "@/components/PieChartComponent";
import { BarChartComponent } from "@/components/BarChartComponent";
import { SessionSummaryTable } from "@/components/SessionSummaryTable";
import { SetupDialog } from "@/components/SetupDialog";
// import { FeaturesPieChart } from "@/components/FeaturesPieChart";
import Navbar from "@/components/Navbar";
import Cards from "@/components/Cards";
import DualMonthYearPicker from "@/components/MonthRangePicker";
import FeaturesPieChart from "@/components/FeaturesPieChart";

export default function Dashboard() {
  const [startDate, setStartDate] = useState<string>();
  const [endDate, setEndDate] = useState<string>();

  return (
    <>
      <Navbar />

      {/* Header Section */}
      <div className="container mx-auto p-4 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight font-mono text-white">
            Analytics Dashboard
          </h1>
          <SetupDialog />
          <DualMonthYearPicker
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={(date) => {
              setStartDate(date);
            }}
            onEndDateChange={(date) => {
              setEndDate(date);
            }}
          />
        </div>

        {/* Cards Section */}
        <Cards startDate={startDate} endDate={endDate} />

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-2">
            <BarChartComponent startDate={startDate} endDate={endDate} />
          </div>
          <div className="lg:col-span-1">
            <FeaturesPieChart startDate={startDate} endDate={endDate} />
          </div>
          <div className="lg:col-span-1">
            <PieChartComponent startDate={startDate} endDate={endDate} />
          </div>
        </div>

        {/* Table */}
        <SessionSummaryTable startDate={startDate} endDate={endDate} />
      </div>
    </>
  );
}
