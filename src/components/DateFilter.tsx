"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  setStartDate: (value: string) => void;
  setEndDate: (value: string) => void;
}

function parseDate(str: string) {
  const [day, month, year] = str.split("-");
  return new Date(`${year}-${month}-${day}`);
}

export default function DateRangePicker({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
}: DateRangePickerProps) {
  const [openStart, setOpenStart] = React.useState(false);
  const [openEnd, setOpenEnd] = React.useState(false);

  const handleStartSelect = (date?: Date) => {
    if (!date) return;
    const formatted = format(date, "dd-MM-yyyy");
    setStartDate(formatted);

    if (endDate && parseDate(endDate) < date) {
      setEndDate(formatted);
    }
    setOpenStart(false);
  };

  const handleEndSelect = (date?: Date) => {
    if (!date) return;
    if (!startDate || date >= parseDate(startDate)) {
      const formatted = format(date, "dd-MM-yyyy");
      setEndDate(formatted);
    }
    setOpenEnd(false);
  };

  return (
    <div className="flex flex-col sm:flex-row items-center font-mono gap-6">
      {/* Start Date */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-gray-700">Start Date:</span>
        <Popover open={openStart} onOpenChange={setOpenStart}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-40 justify-between text-gray-800 font-medium"
            >
              {startDate || "Select Date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 rounded-xl shadow-lg">
            <Calendar
              mode="single"
              selected={startDate ? parseDate(startDate) : undefined}
              onSelect={handleStartSelect}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* End Date */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-gray-700">End Date:</span>
        <Popover open={openEnd} onOpenChange={setOpenEnd}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-40 justify-between text-gray-800 font-medium"
            >
              {endDate || "Select Date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 rounded-xl shadow-lg">
            <Calendar
              mode="single"
              selected={endDate ? parseDate(endDate) : undefined}
              onSelect={handleEndSelect}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
