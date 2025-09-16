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
      <CardHeader className="text-center font-mono">
        <CardTitle className="text-2xl font-semibold text-gray-800 tracking-wide uppercase">
          Complains
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6 font-mono">
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

// "use client";

// import { useEffect, useState } from "react";
// import {
//   ChevronLeft,
//   ChevronRight,
//   ChevronsLeft,
//   ChevronsRight,
//   Download,
//   Loader2,
// } from "lucide-react";
// import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "./ui/table";
// import DateFilter from "./DateFilter";
// import { formatDate } from "@/lib/utils";
// import { Button } from "./ui/button";
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "./ui/select";

// interface Column {
//   name: string;
//   id: string;
// }

// interface ApiResponse {
//   data: {
//     Columns: Column[];
//     // eslint-disable-next-line
//     Records: Record<string, any>[];
//   };
//   message: string;
//   success: boolean;
// }

// export function ComplainsTable() {
//   const today = formatDate(new Date());
//   const [startDate, setStartDate] = useState(today);
//   const [endDate, setEndDate] = useState(today);
//   const [columns, setColumns] = useState<Column[]>([]);
//   // eslint-disable-next-line
//   const [records, setRecords] = useState<Record<string, any>[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   // pagination data
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageSize, setPageSize] = useState("10");
//   const [totalRecords, setTotalRecords] = useState(0);

//   useEffect(() => {
//     const fetchComplainData = async () => {
//       setIsLoading(true);
//       try {
//         const url = new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/Complains`);
//         url.searchParams.append("startPeriod", startDate);
//         url.searchParams.append("endPeriod", endDate);
//         url.searchParams.append("format", "json");

//         const response = await fetch(url.toString());
//         const responseData: ApiResponse = await response.json();

//         setColumns(responseData?.data?.Columns || []);
//         setRecords(responseData?.data?.Records || []);
//         setTotalRecords(responseData?.data?.Records?.length || 0);
//       } catch (error) {
//         console.error("Failed to fetch complain data:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchComplainData();
//   }, [startDate, endDate]);

//   const handleDownload = async () => {
//     try {
//       const url = new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/Complains`);
//       url.searchParams.append("startPeriod", startDate);
//       url.searchParams.append("endPeriod", endDate);
//       url.searchParams.append("format", "excel");

//       const response = await fetch(url.toString(), {
//         method: "GET",
//       });

//       if (!response.ok) {
//         throw new Error(`Failed to fetch: ${response.statusText}`);
//       }

//       // Convert response to Blob (Excel file)
//       const blob = await response.blob();

//       // Create temporary URL for the blob
//       const downloadUrl = window.URL.createObjectURL(blob);

//       // Create and click a hidden link to trigger download
//       const link = document.createElement("a");
//       link.href = downloadUrl;
//       link.download = `Complains_${startDate}_${endDate}.xlsx`; // Suggested file name
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);

//       // Revoke the object URL to free memory
//       window.URL.revokeObjectURL(downloadUrl);
//     } catch (error) {
//       console.error("Error fetching the data:", error);
//     }
//   };

//   const totalPages = Math.max(1, Math.ceil(totalRecords / parseInt(pageSize)));
//   const startItem =
//     totalRecords === 0 ? 0 : (currentPage - 1) * parseInt(pageSize) + 1;
//   const endItem = Math.min(currentPage * parseInt(pageSize), totalRecords);

//   const paginatedData = records.slice(
//     (currentPage - 1) * parseInt(pageSize),
//     currentPage * parseInt(pageSize)
//   );
//   return (
//     <Card className="border border-gray-200 shadow-lg rounded-2xl bg-white p-6">
//       <CardHeader className="text-center">
//         <CardTitle className="text-xl font-semibold font-mono text-gray-800 tracking-wide uppercase">
//           Complains
//         </CardTitle>
//       </CardHeader>

//       <CardContent className="space-y-6">
//         <div className="flex items-center justify-between">
//           <DateFilter
//             startDate={startDate}
//             endDate={endDate}
//             setStartDate={setStartDate}
//             setEndDate={setEndDate}
//           />

//           <Button
//             onClick={handleDownload}
//             variant="outline"
//             className="flex items-center gap-2 font-mono hover:bg-gray-100 transition-colors shadow-sm"
//           >
//             <Download className="w-5 h-5" />
//             <span className="font-medium">Download</span>
//           </Button>
//         </div>

//         {isLoading ? (
//           <div className="flex justify-center items-center h-64">
//             <div className="flex flex-col items-center gap-3">
//               <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
//               <p className="text-gray-500">Loading data...</p>
//             </div>
//           </div>
//         ) : records.length === 0 ? (
//           <p className="text-center text-gray-500 py-10">
//             No complaints found for the selected dates.
//           </p>
//         ) : (
//           <div className="border rounded-lg overflow-hidden h-[40vh]">
//             <div className="overflow-auto h-full">
//               <table className="w-full text-sm relative table-auto">
//                 <thead className="bg-[#161616] sticky top-0 z-20 border-b text-white">
//                   <tr>
//                     {columns.map((col) => (
//                       <thead
//                         key={col.id}
//                         className="p-3 text-left font-medium border-r whitespace-nowrap"
//                       >
//                         {col.name}
//                       </thead>
//                     ))}
//                   </tr>
//                 </thead>

//                 <TableBody>
//                   {paginatedData.length > 0 ? (
//                     paginatedData.map((record, index) => (
//                       <TableRow
//                         key={index}
//                         className="border-b hover:bg-muted/30"
//                       >
//                         {/* Optional sticky first column */}
//                         <TableCell className="p-3 border-r font-medium text-muted-foreground bg-background/95 sticky left-0 z-10">
//                           {index + 1}
//                         </TableCell>

//                         {columns.map((col) => (
//                           <TableCell
//                             key={col.id}
//                             className="p-3 border-r whitespace-nowrap"
//                           >
//                             <div className="max-w-[400px] truncate">
//                               {record[col.id] ?? " "}
//                             </div>
//                           </TableCell>
//                         ))}
//                       </TableRow>
//                     ))
//                   ) : (
//                     <TableRow>
//                       <TableCell
//                         colSpan={columns.length + 1}
//                         className="text-center text-muted-foreground py-4"
//                       >
//                         No complaints found. Click &quot;Add New&quot; to create
//                         your first item.
//                       </TableCell>
//                     </TableRow>
//                   )}
//                 </TableBody>
//               </table>
//             </div>
//           </div>
//         )}

//         <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4">
//           <div className="flex items-center gap-2 text-sm text-gray-600">
//             <span>Rows per page:</span>
//             <Select
//               value={pageSize}
//               onValueChange={(value) => {
//                 setPageSize(value);
//                 setCurrentPage(1);
//               }}
//             >
//               <SelectTrigger className="w-[80px] h-8">
//                 <SelectValue placeholder="10" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectGroup>
//                   <SelectItem value="10">10</SelectItem>
//                   <SelectItem value="25">25</SelectItem>
//                   <SelectItem value="50">50</SelectItem>
//                   <SelectItem value="100">100</SelectItem>
//                 </SelectGroup>
//               </SelectContent>
//             </Select>
//           </div>

//           <div className="text-sm text-gray-600">
//             {startItem}-{endItem} of {totalRecords}
//           </div>
//           <div className="flex items-center gap-1">
//             <Button
//               variant="ghost"
//               size="icon"
//               onClick={() => setCurrentPage(1)}
//               disabled={currentPage === 1}
//               className="text-gray-600 hover:bg-gray-100"
//             >
//               <ChevronsLeft className="h-4 w-4" />
//             </Button>
//             <Button
//               variant="ghost"
//               size="icon"
//               onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//               disabled={currentPage === 1}
//               className="text-gray-600 hover:bg-gray-100"
//             >
//               <ChevronLeft className="h-4 w-4" />
//             </Button>
//             <div className="text-sm text-gray-600 mx-2">
//               Page {currentPage} of {totalPages}
//             </div>
//             <Button
//               variant="ghost"
//               size="icon"
//               onClick={() =>
//                 setCurrentPage((prev) => Math.min(prev + 1, totalPages))
//               }
//               disabled={currentPage === totalPages}
//               className="text-gray-600 hover:bg-gray-100"
//             >
//               <ChevronRight className="h-4 w-4" />
//             </Button>
//             <Button
//               variant="ghost"
//               size="icon"
//               onClick={() => setCurrentPage(totalPages)}
//               disabled={currentPage === totalPages}
//               className="text-gray-600 hover:bg-gray-100"
//             >
//               <ChevronsRight className="h-4 w-4" />
//             </Button>
//           </div>
//         </div>
//         {/* Ending pagination */}
//       </CardContent>
//     </Card>
//   );
// }
