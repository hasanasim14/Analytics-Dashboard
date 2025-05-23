"use client";

import { useEffect, useState } from "react";
import {
  Bot,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  User,
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

export function SessionSummaryTable() {
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

    console.log("the sesison is ", session?.sessionID);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/transcript?sessionid=${session?.sessionID}`,
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
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/Sessions`,
          {
            method: "GET",
          }
        );

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
  }, []);

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
      <Card className="gap-1">
        <CardHeader>
          <CardTitle>Session Summary</CardTitle>
        </CardHeader>
        <CardContent className="px-4 pt-2">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <p>Loading session data...</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto rounded-md border">
                <Table>
                  <TableHeader className="bg-[#e05d44] text-white">
                    <TableRow>
                      <TableHead className="font-medium text-white">
                        Session ID
                      </TableHead>
                      <TableHead className="font-medium text-white">
                        Total Cost (PKR)
                      </TableHead>
                      <TableHead className="font-medium text-white">
                        Total Messages
                      </TableHead>
                      <TableHead className="font-medium text-white">
                        Session Start
                      </TableHead>
                      <TableHead className="font-medium text-white">
                        Session End
                      </TableHead>
                      <TableHead className="font-medium text-white">
                        Duration (Minutes)
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedData.map((session, index) => (
                      <TableRow
                        key={index}
                        onClick={() => handleRowClick(session)}
                        className="cursor-pointer hover:bg-gray-50"
                      >
                        <TableCell className="max-w-[200px] truncate">
                          {session.sessionID}
                        </TableCell>
                        <TableCell>
                          {session.Total_Cost_PKR.toFixed(2)}
                        </TableCell>
                        <TableCell>{session.Total_Messages}</TableCell>
                        <TableCell>
                          {new Date(session.Session_Start).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {new Date(session.Session_End).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {session.Duration_Mins.toFixed(1)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <span>Page Size:</span>
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

                <div className="text-sm text-muted-foreground">
                  {startItem} to {endItem} of {totalRecords}
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronsLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div className="text-sm">
                    Page {currentPage} of {totalPages}
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Session Transcript</DialogTitle>
          </DialogHeader>

          {selectedSession && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium">Session ID:</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedSession.sessionID}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">Total Cost:</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedSession.Total_Cost_PKR.toFixed(2)} PKR
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">Total Messages:</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedSession.Total_Messages}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">Duration:</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedSession.Duration_Mins.toFixed(1)} minutes
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Conversation:</h3>
                {isTranscriptLoading ? (
                  <div className="flex justify-center items-center h-32">
                    <p>Loading transcript...</p>
                  </div>
                ) : (
                  <div className="border rounded-lg p-4 space-y-4">
                    {transcript.length > 0 ? (
                      transcript.map((msg, index) => (
                        <div
                          key={index}
                          className={`p-3 rounded-lg ${
                            msg.type === "user" ? "bg-blue-50" : "bg-gray-50"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            {msg.type === "user" ? (
                              <User className="h-5 w-5 mt-0.5 text-blue-600 flex-shrink-0" />
                            ) : (
                              <Bot className="h-5 w-5 mt-0.5 text-gray-600 flex-shrink-0" />
                            )}
                            <div className="flex-1">
                              <p className="text-gray-800 whitespace-pre-wrap">
                                {msg.content}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-muted-foreground">
                        No transcript available
                      </p>
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
