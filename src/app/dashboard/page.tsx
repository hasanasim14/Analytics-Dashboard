"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChartComponent } from "@/components/PieChartComponent";
import { BarChartComponent } from "@/components/BarChartComponent";
import { SessionSummaryTable } from "@/components/SessionSummaryTable";
import Navbar from "@/components/Navbar";

export default function Dashboard() {
  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4 space-y-4 bg-[#e8d8d2]">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="text-center">
            <CardHeader className="pb-2">
              <CardTitle className="text-m font-medium text-muted-foreground">
                Total Spent
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">46.5 PKR</div>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader className="pb-2">
              <CardTitle className="text-m font-medium text-muted-foreground">
                Number Of Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">114</div>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader className="pb-2">
              <CardTitle className="text-m font-medium text-muted-foreground">
                Average Cost per session
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0.41 PKR</div>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader className="pb-2">
              <CardTitle className="text-m font-medium text-muted-foreground">
                Average Number of Session per Day
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">9</div>
            </CardContent>
          </Card>
        </div>

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
