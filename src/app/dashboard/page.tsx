"use client";

import { PieChartComponent } from "@/components/PieChartComponent";
import { BarChartComponent } from "@/components/BarChartComponent";
import { SessionSummaryTable } from "@/components/SessionSummaryTable";
import Navbar from "@/components/Navbar";
import Cards from "@/components/Cards";
import DualMonthYearPicker from "@/components/MonthRangePicker";

export default function Dashboard() {
  return (
    <>
      <Navbar />

      {/* Header Section */}
      <div className="container mx-auto p-4 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight font-mono text-white">
            Analytics Dashboard
          </h1>
          <DualMonthYearPicker />
        </div>

        {/* Cards Section */}
        <Cards />

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3">
            <BarChartComponent />
          </div>
          <div className="lg:col-span-1">
            <PieChartComponent />
          </div>
        </div>

        {/* Table */}
        <SessionSummaryTable />
      </div>
    </>
  );
}
