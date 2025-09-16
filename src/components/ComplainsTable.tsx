"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
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

interface Column {
  name: string; // Display name
  id: string; // Key to use from record
}

interface ApiResponse {
  data: {
    Columns: Column[];
    Records: Record<string, any>[]; // Each record is a dynamic object
  };
  message: string;
  success: boolean;
}

export function ComplainsTable() {
  const today = formatDate(new Date());
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [columns, setColumns] = useState<Column[]>([]);
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

  return (
    <Card className="border border-gray-200 shadow-lg rounded-xl p-4 bg-white">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-xl font-semibold font-mono uppercase tracking-widest text-gray-800">
          Complains
        </CardTitle>
      </CardHeader>

      <CardContent>
        {/* Date filter */}
        <div className="flex justify-end mb-4">
          <DateFilter
            startDate={startDate}
            endDate={endDate}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
          />
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
                      className="font-semibold uppercase tracking-wide text-white px-4 py-3 text-sm"
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
