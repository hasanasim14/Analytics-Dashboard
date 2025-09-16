"use client";

import { useEffect, useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import DateFilter from "./DateFilter";
import { formatDate } from "@/lib/utils";
import { Button } from "./ui/button";

interface Column {
  name: string;
  id: string;
}

interface ApiResponse {
  data: {
    Columns: Column[];
    // eslint-disable-next-line
    Records: Record<string, any>[];
  };
  message: string;
  success: boolean;
}

export function ComplainsTable() {
  const today = formatDate(new Date());
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [columns, setColumns] = useState<Column[]>([]);
  // eslint-disable-next-line
  const [records, setRecords] = useState<Record<string, any>[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchComplainData = async () => {
      setIsLoading(true);
      try {
        const url = new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/Complains`);
        url.searchParams.append("startPeriod", startDate);
        url.searchParams.append("endPeriod", endDate);
        url.searchParams.append("format", "json");

        const response = await fetch(url.toString());
        const responseData: ApiResponse = await response.json();

        setColumns(responseData?.data?.Columns || []);
        setRecords(responseData?.data?.Records || []);
      } catch (error) {
        console.error("Failed to fetch complain data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComplainData();
  }, [startDate, endDate]);

  const handleDownload = async () => {
    try {
      const url = new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/Complains`);
      url.searchParams.append("startPeriod", startDate);
      url.searchParams.append("endPeriod", endDate);
      url.searchParams.append("format", "excel");

      const response = await fetch(url.toString(), {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`);
      }

      // Convert response to Blob (Excel file)
      const blob = await response.blob();

      // Create temporary URL for the blob
      const downloadUrl = window.URL.createObjectURL(blob);

      // Create and click a hidden link to trigger download
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `Complains_${startDate}_${endDate}.xlsx`; // Suggested file name
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Revoke the object URL to free memory
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Error fetching the data:", error);
    }
  };

  return (
    <Card className="border border-gray-200 shadow-lg rounded-2xl bg-white p-6">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-2xl font-semibold text-gray-800 tracking-wide uppercase">
          Complains
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <DateFilter
            startDate={startDate}
            endDate={endDate}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
          />

          <Button
            onClick={handleDownload}
            variant="outline"
            className="flex items-center gap-2 hover:bg-gray-100 transition-colors shadow-sm"
          >
            <Download className="w-5 h-5" />
            <span className="font-medium">Download</span>
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              <p className="text-gray-500">Loading data...</p>
            </div>
          </div>
        ) : records.length === 0 ? (
          <p className="text-center text-gray-500 py-10">
            No complaints found for the selected dates.
          </p>
        ) : (
          <div className="rounded-lg border border-gray-200 overflow-auto">
            <Table className="min-w-[800px]">
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-[#e05d44] to-[#c84b34] text-white">
                  {columns.map((col) => (
                    <TableHead
                      key={col.id}
                      className="font-semibold tracking-wide text-white px-4 py-3 text-sm"
                    >
                      {col.name}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((record, rowIndex) => (
                  <TableRow
                    key={rowIndex}
                    className="even:bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    {columns.map((col) => (
                      <TableCell
                        key={col.id}
                        className="px-4 py-2 text-gray-700 max-w-[250px] truncate"
                      >
                        {record[col.id] ?? "-"}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
