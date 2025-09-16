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
  Search,
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
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";

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
    Columns: { name: string; id: string }[];
    Records: Session[];
  };
  success: boolean;
  message: string;
}

interface TranscriptResponse {
  data: TranscriptMessage[];
  badges: Record<string, number>;
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
  const [badges, setBadges] = useState({});
  const [consignNumber, setConsignNumber] = useState(false);
  const [tagNumber, setTagNumber] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const handleRowClick = async (session: Session) => {
    setSelectedSession(session);
    setIsTranscriptLoading(true);
    setIsDialogOpen(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/transcript?sessionid=${session.sessionID}`
      );
      const responseData: TranscriptResponse = await res.json();
      setTranscript(responseData?.data || []);
      setBadges(responseData?.badges || {});
    } catch (err) {
      console.error("Failed to fetch transcript:", err);
    } finally {
      setIsTranscriptLoading(false);
    }
  };

  const fetchSessionData = async (value?: string) => {
    setIsLoading(true);
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

      if (consignNumber && value?.trim()) {
        const numbers = value
          .split(",")
          .map((v) => v.trim())
          .filter(Boolean);
        numbers.forEach((num) =>
          url.searchParams.append("consignmentNumbers", num)
        );
      } else if (tagNumber && value?.trim()) {
        url.searchParams.append("tag", value.trim());
      } else if (!tagNumber && !consignNumber) {
        const query = value?.trim() || "";
        if (query) {
          url.searchParams.append("userQuery", query);
        }
      }

      const res = await fetch(url.toString());
      const responseData: ApiResponse = await res.json();
      setSessionData(responseData?.data?.Records || []);
      setTotalRecords(responseData?.data?.Records?.length || 0);
    } catch (err) {
      console.error("Failed to fetch session data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch with no filters
  useEffect(() => {
    fetchSessionData();
  }, [startDate, endDate]);

  const handleConNumberChange = (checked: boolean) => {
    setConsignNumber(checked);
    if (checked) setTagNumber(false);
  };

  const handleTagChange = (checked: boolean) => {
    setTagNumber(checked);
    if (checked) setConsignNumber(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      fetchSessionData(searchValue);
    }
  };

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
        <CardContent className="px-6 pb-6 font-mono">
          {/* Filters */}
          <div className="flex justify-end mb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              {/* Shared search input */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search or enter consignment numbers..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#e05d44] focus:border-[#e05d44] transition-colors"
                />
              </div>

              {/* Checkboxes */}
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <Checkbox
                    checked={consignNumber}
                    onCheckedChange={handleConNumberChange}
                    className="data-[state=checked]:bg-[#e05d44] data-[state=checked]:border-[#e05d44]"
                  />
                  Consignment Number
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <Checkbox
                    checked={tagNumber}
                    onCheckedChange={handleTagChange}
                    className="data-[state=checked]:bg-[#e05d44] data-[state=checked]:border-[#e05d44]"
                  />
                  Tag
                </label>
              </div>
            </div>
          </div>

          {/* Table */}
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              <p className="text-gray-500 ml-2">Loading session data...</p>
            </div>
          ) : (
            <>
              <div className="rounded-lg border border-gray-200 overflow-hidden">
                <Table className="min-w-[1000px]">
                  <TableHeader>
                    <TableRow className="bg-[#e05d44] text-white hover:bg-[#e05c44] transition-colors">
                      <TableHead className="text-white">Session ID</TableHead>
                      <TableHead className="text-white">Total Cost</TableHead>
                      <TableHead className="text-white">Messages</TableHead>
                      <TableHead className="text-white">Start Time</TableHead>
                      <TableHead className="text-white">End Time</TableHead>
                      <TableHead className="text-white">Duration</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedData.map((session) => (
                      <TableRow
                        key={session.sessionID}
                        onClick={() => handleRowClick(session)}
                        className="cursor-pointer hover:bg-gray-50/50"
                      >
                        <TableCell>{session.sessionID}</TableCell>
                        <TableCell>
                          {session.Total_Cost_PKR.toFixed(2)} PKR
                        </TableCell>
                        <TableCell>{session.Total_Messages}</TableCell>
                        <TableCell>{session.Session_Start}</TableCell>
                        <TableCell>{session.Session_End}</TableCell>
                        <TableCell>
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
                  >
                    <ChevronsLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
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
                      setCurrentPage((p) => Math.min(p + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronsRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Transcript Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col p-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b">
            <DialogTitle className="text-lg font-semibold text-gray-800">
              Session Transcript
            </DialogTitle>
          </DialogHeader>
          {selectedSession && (
            <div className="flex-1 overflow-auto p-6 space-y-6">
              {badges && Object.keys(badges).length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {Object.entries(badges).map(([key, value]) => (
                    <Badge key={key} className="bg-[#e05d44] text-white">
                      {`${key}: ${value}`}
                    </Badge>
                  ))}
                </div>
              )}
              {isTranscriptLoading ? (
                <div className="flex justify-center items-center h-32">
                  <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                  <p className="text-sm text-gray-500">Loading transcript...</p>
                </div>
              ) : transcript.length > 0 ? (
                transcript.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-lg ${
                      msg.type === "user"
                        ? "bg-blue-50 border border-blue-100"
                        : "bg-gray-50 border border-gray-100"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-1.5 rounded-full ${
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
                      <div>
                        <span className="block text-xs text-gray-400 mb-1">
                          {new Date(msg.ts).toLocaleString()}
                        </span>
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex justify-center items-center h-32 border border-dashed rounded-lg">
                  <p className="text-sm text-gray-500">
                    No transcript available
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
