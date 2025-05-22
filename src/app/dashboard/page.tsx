"use client";

import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PieChartComponent } from "@/components/PieChartComponent";
import { BarChartComponent } from "@/components/BarChartComponent";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Session {
  id: string;
  cost: string;
  messages: number;
  start: string;
  end: string;
  duration: string;
}

export default function Dashboard() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState("10");
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const totalPages = 19;

  // Sample data for the session table
  const sessionData: Session[] = [
    {
      id: "9a123965-9c1c-44cc-bc82-35d0458...",
      cost: "0.56",
      messages: 11,
      start: "2023-04-03T16:50:26.68...",
      end: "2023-04-03T17:00:12.42...",
      duration: "9.8",
    },
    {
      id: "22078c3-1274-4094-a368-ba9dcbc9...",
      cost: "0.06",
      messages: 2,
      start: "2023-04-03T16:34:01.36...",
      end: "2023-04-03T16:34:16.93...",
      duration: "0.3",
    },
    {
      id: "6c9d27c6-704a-406c-8956-77742c8a...",
      cost: "0.53",
      messages: 10,
      start: "2023-04-03T16:31:20.68...",
      end: "2023-04-03T16:33:49.04...",
      duration: "2.5",
    },
    {
      id: "...",
      cost: "0.02",
      messages: 1,
      start: "2023-04-03T16:30:11.66...",
      end: "2023-04-03T16:30:11.66...",
      duration: "0",
    },
    {
      id: "1",
      cost: "0.88",
      messages: 11,
      start: "2023-04-03T16:19:37.04...",
      end: "2023-04-03T16:23:45.48...",
      duration: "5.1",
    },
  ];

  const handleRowClick = (session: Session) => {
    setSelectedSession(session);
    setIsDialogOpen(true);
  };

  // Mock conversation data for the dialog
  const mockConversation = [
    { speaker: "User", message: "Hello, how are you?", timestamp: "16:50:26" },
    {
      speaker: "AI",
      message: "I'm doing well, thanks for asking! How can I help you today?",
      timestamp: "16:50:28",
    },
    {
      speaker: "User",
      message: "Can you tell me about your features?",
      timestamp: "16:50:35",
    },
    {
      speaker: "AI",
      message:
        "Certainly! I can answer questions, provide information, and assist with various tasks. What specifically would you like to know?",
      timestamp: "16:50:37",
    },
  ];

  return (
    <div className="container mx-auto p-4 space-y-4">
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

      {/* Session Summary Table */}
      <Card className="gap-1">
        <CardHeader>
          <CardTitle>Session Summary</CardTitle>
        </CardHeader>
        <CardContent className="px-4 pt-2">
          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader className="bg-[#e05d44] text-white">
                <TableRow>
                  <TableHead className="font-medium text-white">
                    SessionID
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
                {sessionData.map((session, index) => (
                  <TableRow
                    key={index}
                    onClick={() => handleRowClick(session)}
                    className="cursor-pointer hover:bg-gray-50"
                  >
                    <TableCell>{session.id}</TableCell>
                    <TableCell>{session.cost}</TableCell>
                    <TableCell>{session.messages}</TableCell>
                    <TableCell>{session.start}</TableCell>
                    <TableCell>{session.end}</TableCell>
                    <TableCell>{session.duration}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>Page Size:</span>
              <Select value={pageSize} onValueChange={setPageSize}>
                <SelectTrigger className="w-[80px] h-8">
                  <SelectValue placeholder="10" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="75">75</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="text-sm text-muted-foreground">
              {currentPage} to {Math.min(currentPage * 10, 185)} of 185
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
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
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
        </CardContent>
      </Card>

      {/* Session Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Session Details</DialogTitle>
          </DialogHeader>

          {selectedSession && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium">Session ID</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedSession.id}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">Total Cost</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedSession.cost} PKR
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">Total Messages</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedSession.messages}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">Duration</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedSession.duration} minutes
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Conversation</h3>
                <div className="border rounded-lg p-4 space-y-4">
                  {mockConversation.map((msg, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg ${
                        msg.speaker === "User" ? "bg-blue-50" : "bg-gray-50"
                      }`}
                    >
                      <div className="flex justify-between items-baseline">
                        <span className="font-medium">{msg.speaker}</span>
                        <span className="text-xs text-muted-foreground">
                          {msg.timestamp}
                        </span>
                      </div>
                      <p className="mt-1">{msg.message}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Additional Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p>
                      <span className="font-medium">Start Time:</span>{" "}
                      {selectedSession.start}
                    </p>
                    <p>
                      <span className="font-medium">End Time:</span>{" "}
                      {selectedSession.end}
                    </p>
                  </div>
                  <div>
                    <p>
                      <span className="font-medium">Model Used:</span>{" "}
                      GPT-3.5-turbo
                    </p>
                    <p>
                      <span className="font-medium">Tokens Used:</span> 1,234
                      (Prompt: 456, Completion: 778)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
