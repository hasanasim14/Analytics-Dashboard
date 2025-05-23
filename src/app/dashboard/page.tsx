"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChartComponent } from "@/components/PieChartComponent";
import { BarChartComponent } from "@/components/BarChartComponent";
import { SessionSummaryTable } from "@/components/SessionSummaryTable";
import Navbar from "@/components/Navbar";
import Cards from "@/components/Cards";

export default function Dashboard() {
  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4 space-y-4">
        {/* Key Metrics */}
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
