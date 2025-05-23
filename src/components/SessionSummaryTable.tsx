"use client";

import { useState } from "react";
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
  id: string;
  cost: string;
  messages: number;
  start: string;
  end: string;
  duration: string;
}

export function SessionSummaryTable() {
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState("10");
  const totalPages = 19;

  const sessionData: Session[] = [
    {
      id: "9a123965-9c1c-44cc-bc82-35d0458",
      cost: "0.56",
      messages: 11,
      start: "2023-04-03T16:50:26.68...",
      end: "2023-04-03T17:00:12.42...",
      duration: "9.8",
    },
    {
      id: "22078c3-1274-4094-a368-ba9dcbc9",
      cost: "0.06",
      messages: 2,
      start: "2023-04-03T16:34:01.36...",
      end: "2023-04-03T16:34:16.93...",
      duration: "0.3",
    },
    {
      id: "6c9d27c6-704a-406c-8956-77742c8a",
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
      start: "2023-04-03T16:30:11.66",
      end: "2023-04-03T16:30:11.66...",
      duration: "0",
    },
    {
      id: "1",
      cost: "0.88",
      messages: 11,
      start: "2023-04-03T16:19:37.04",
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
    <>
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedSession?.id}</DialogTitle>
          </DialogHeader>

          {selectedSession && (
            <div className="space-y-6">
              <div>
                <div className="border rounded-lg p-4 space-y-4">
                  {mockConversation.map((msg, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg ${
                        msg.speaker === "User" ? "bg-blue-50" : "bg-gray-50"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {msg.speaker === "User" ? (
                          <User className="h-5 w-5 mt-0.5 text-blue-600 flex-shrink-0" />
                        ) : (
                          <Bot className="h-5 w-5 mt-0.5 text-gray-600 flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <p className="text-gray-800">{msg.message}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
