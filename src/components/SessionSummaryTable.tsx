"use client";

import { useEffect, useState } from "react";
import {
  Bot,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  User,
  Loader2,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { DateRange } from "@/lib/types";
import ReactMarkdown from "react-markdown";

interface Session {
  sessionID: string;
  Total_Cost_PKR: number;
  Total_Messages: number;
  Session_Start: string;
  Session_End: string;
  Duration_Mins: number;
}

interface TranscriptMessage {
  type: string;
  content: string;
  ts: string;
}

interface ApiResponse {
  data: {
    Columns: {
      name: string;
      id: string;
    }[];
    Records: Session[];
  };
  success: boolean;
  message: string;
}

interface TranscriptResponse {
  data: TranscriptMessage[];
  success: boolean;
  message: string;
}

export function SessionSummaryTable({ startDate, endDate }: DateRange) {
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState("10");
  const [totalRecords, setTotalRecords] = useState(0);
  const [sessionData, setSessionData] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [transcript, setTranscript] = useState<TranscriptMessage[]>([]);
  const [isTranscriptLoading, setIsTranscriptLoading] = useState(false);

  const handleRowClick = async (session: Session) => {
    setSelectedSession(session);
    setIsTranscriptLoading(true);
    setIsDialogOpen(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/transcript?sessionid=${session.sessionID}`,
        {
          method: "GET",
        }
      );

      const responseData: TranscriptResponse = await response.json();
      setTranscript(responseData.data || []);
    } catch (error) {
      console.error("Failed to fetch transcript:", error);
    } finally {
      setIsTranscriptLoading(false);
    }
  };

  useEffect(() => {
    const fetchSessionData = async () => {
      //Checking the props for current if not found setting it as the current month and year
      const currentDate = new Date();
      const currentMonth = `${String(currentDate.getMonth() + 1).padStart(
        2,
        "0"
      )}-${currentDate.getFullYear()}`;

      const startPeriod = startDate || currentMonth;
      const endPeriod = endDate || currentMonth;

      try {
        const url = new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/Sessions`);
        url.searchParams.append("startPeriod", startPeriod);
        url.searchParams.append("endPeriod", endPeriod);

        const response = await fetch(url.toString());

        const responseData: ApiResponse = await response.json();
        setSessionData(responseData.data.Records);
        setTotalRecords(responseData.data.Records.length);
      } catch (error) {
        console.error("Failed to fetch session data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSessionData();
  }, [startDate, endDate]);

  // Calculate pagination values
  const totalPages = Math.ceil(totalRecords / parseInt(pageSize));
  const startItem = (currentPage - 1) * parseInt(pageSize) + 1;
  const endItem = Math.min(currentPage * parseInt(pageSize), totalRecords);
  const paginatedData = sessionData.slice(
    (currentPage - 1) * parseInt(pageSize),
    currentPage * parseInt(pageSize)
  );

  return (
    <>
      <Card className="border-none shadow-sm p-4">
        <CardHeader className="text-center">
          <CardTitle className="text-xl font-semibold font-mono uppercase tracking-widest text-gray-800">
            Session Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                <p className="text-gray-500">Loading session data...</p>
              </div>
            </div>
          ) : (
            <>
              <div className="rounded-lg border border-gray-200 overflow-hidden">
                <Table className="min-w-[1000px]">
                  <TableHeader>
                    <TableRow className="bg-[#e05d44] text-white hover:bg-[#e05c44] font-mono transition-colors">
                      <TableHead className="font-medium text-white">
                        Session ID
                      </TableHead>
                      <TableHead className="font-medium text-white">
                        Total Cost
                      </TableHead>
                      <TableHead className="font-medium text-white">
                        Messages
                      </TableHead>
                      <TableHead className="font-medium text-white">
                        Start Time
                      </TableHead>
                      <TableHead className="font-medium text-white">
                        End Time
                      </TableHead>
                      <TableHead className="font-medium text-white">
                        Duration
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {paginatedData.map((session, index) => (
                      <TableRow
                        key={index}
                        onClick={() => handleRowClick(session)}
                        className="cursor-pointer transition-colors hover:bg-gray-50/50"
                      >
                        <TableCell className="font-medium text-gray-800 max-w-[200px] truncate">
                          {session.sessionID}
                        </TableCell>
                        <TableCell className="text-gray-700">
                          {session.Total_Cost_PKR.toFixed(2)} PKR
                        </TableCell>
                        <TableCell className="text-gray-700">
                          {session.Total_Messages}
                        </TableCell>
                        <TableCell className="text-gray-700">
                          {session.Session_Start}
                        </TableCell>
                        <TableCell className="text-gray-700">
                          {session.Session_End}
                        </TableCell>
                        <TableCell className="text-gray-700">
                          {session.Duration_Mins.toFixed(1)} min
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>Rows per page:</span>
                  <Select
                    value={pageSize}
                    onValueChange={(value) => {
                      setPageSize(value);
                      setCurrentPage(1);
                    }}
                  >
                    <SelectTrigger className="w-[80px] h-8">
                      <SelectValue placeholder="10" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="25">25</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="100">100</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className="text-sm text-gray-600">
                  {startItem}-{endItem} of {totalRecords}
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    className="text-gray-600 hover:bg-gray-100"
                  >
                    <ChevronsLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="text-gray-600 hover:bg-gray-100"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div className="text-sm text-gray-600 mx-2">
                    Page {currentPage} of {totalPages}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="text-gray-600 hover:bg-gray-100"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className="text-gray-600 hover:bg-gray-100"
                  >
                    <ChevronsRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col p-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b">
            <DialogTitle className="text-lg font-semibold text-gray-800">
              Session Transcript
            </DialogTitle>
          </DialogHeader>

          {selectedSession && (
            <div className="flex-1 overflow-auto p-6 space-y-6">
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-gray-500">
                  Session ID
                </h3>
                <p className="text-sm font-mono text-gray-800">
                  {selectedSession.sessionID}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-gray-500">
                    Total Cost
                  </h3>
                  <p className="text-sm text-gray-800">
                    {selectedSession.Total_Cost_PKR.toFixed(2)} PKR
                  </p>
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-gray-500">
                    Total Messages
                  </h3>
                  <p className="text-sm text-gray-800">
                    {selectedSession.Total_Messages}
                  </p>
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-gray-500">
                    Duration
                  </h3>
                  <p className="text-sm text-gray-800">
                    {selectedSession.Duration_Mins.toFixed(1)} minutes
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-3">
                  Conversation
                </h3>
                {isTranscriptLoading ? (
                  <div className="flex justify-center items-center h-32">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                      <p className="text-sm text-gray-500">
                        Loading transcript...
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {transcript.length > 0 ? (
                      transcript.map((msg, index) => (
                        <div
                          key={index}
                          className={`p-4 rounded-lg ${
                            msg.type === "user"
                              ? "bg-blue-50/50 border border-blue-100"
                              : "bg-gray-50/50 border border-gray-100"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`p-1.5 rounded-full mt-0.5 ${
                                msg.type === "user"
                                  ? "bg-blue-100 text-blue-600"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {msg.type === "user" ? (
                                <User className="h-4 w-4" />
                              ) : (
                                <Bot className="h-4 w-4" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-baseline mb-1">
                                <span className="text-xs text-gray-400">
                                  {new Date(msg.ts).toLocaleString()}{" "}
                                </span>
                              </div>
                              <ReactMarkdown>
                                {/* <p className="text-gray-800 whitespace-pre-wrap text-sm"> */}
                                {msg.content}
                                {/* </p> */}
                              </ReactMarkdown>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex justify-center items-center h-32 rounded-lg border border-dashed border-gray-200 bg-gray-50/50">
                        <p className="text-sm text-gray-500">
                          No transcript available
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
