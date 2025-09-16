"use client";

import { useState } from "react";
import { PieChartComponent } from "@/components/PieChartComponent";
import { BarChartComponent } from "@/components/BarChartComponent";
import { SessionSummaryTable } from "@/components/SessionSummaryTable";
import { SetupDialog } from "@/components/SetupDialog";
import { InvoicesDialog } from "@/components/InvoicesDialog";
import Navbar from "@/components/Navbar";
import Cards from "@/components/Cards";
import DualMonthYearPicker from "@/components/MonthRangePicker";
import FeaturesPieChart from "@/components/FeaturesPieChart";
import { ComplainsTable } from "@/components/ComplainsTable";

export default function Dashboard() {
  const [startDate, setStartDate] = useState<string>();
  const [endDate, setEndDate] = useState<string>();

  return (
    <>
      <Navbar />

      {/* Header Section */}
      <div className="container mx-auto p-4 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Left: Title */}
          <h1 className="text-3xl font-bold tracking-tight font-mono text-white">
            Analytics Dashboard
          </h1>

          {/* Right: Date picker + buttons */}
          <div className="flex items-center gap-3">
            <SetupDialog />
            <InvoicesDialog />
            <DualMonthYearPicker
              startDate={startDate}
              endDate={endDate}
              onStartDateChange={setStartDate}
              onEndDateChange={setEndDate}
            />
          </div>
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
        <ComplainsTable />
      </div>
    </>
  );
}
