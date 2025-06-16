"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon, ChevronLeft, ChevronRight, X } from "lucide-react";
import { format } from "date-fns";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// const currentYear = new Date().getFullYear();
// const years = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

interface DualMonthYearPickerProps {
  value?: DateRange;
  onChange?: (range: DateRange) => void;
  placeholder?: string;
  className?: string;
}

export default function DualMonthYearPicker({
  value,
  onChange,
  placeholder = "Pick A Date Range",
  className,
}: DualMonthYearPickerProps) {
  const [dateRange, setDateRange] = React.useState<DateRange>(
    value || { from: undefined, to: undefined }
  );
  const [open, setOpen] = React.useState(false);

  // Start month picker state
  const [startMonth, setStartMonth] = React.useState(new Date().getMonth());
  const [startYear, setStartYear] = React.useState(new Date().getFullYear());

  // End month picker state
  const [endMonth, setEndMonth] = React.useState(new Date().getMonth());
  const [endYear, setEndYear] = React.useState(new Date().getFullYear());

  // Update internal state when value prop changes
  React.useEffect(() => {
    if (value) {
      setDateRange(value);
      if (value.from) {
        setStartMonth(value.from.getMonth());
        setStartYear(value.from.getFullYear());
      }
      if (value.to) {
        setEndMonth(value.to.getMonth());
        setEndYear(value.to.getFullYear());
      }
    }
  }, [value]);

  const updateDateRange = (newRange: DateRange) => {
    setDateRange(newRange);
    onChange?.(newRange);
  };

  const handleStartMonthSelect = (monthIndex: number) => {
    setStartMonth(monthIndex);
    const newDate = new Date(startYear, monthIndex, 1);
    const newRange = { from: newDate, to: dateRange.to };

    // If end date exists and is before start date, clear it
    if (dateRange.to && newDate > dateRange.to) {
      newRange.to = undefined;
    }

    updateDateRange(newRange);
  };

  const handleEndMonthSelect = (monthIndex: number) => {
    if (!dateRange.from) return;

    setEndMonth(monthIndex);
    const newDate = new Date(endYear, monthIndex, 1);

    // Only set if it's after start date
    if (newDate >= dateRange.from) {
      updateDateRange({ ...dateRange, to: newDate });
    }
  };

  const navigateStartYear = (direction: "prev" | "next") => {
    setStartYear(direction === "prev" ? startYear - 1 : startYear + 1);
  };

  const navigateEndYear = (direction: "prev" | "next") => {
    setEndYear(direction === "prev" ? endYear - 1 : endYear + 1);
  };

  const clearSelection = () => {
    updateDateRange({ from: undefined, to: undefined });
  };

  const isEndMonthDisabled = (monthIndex: number, year: number) => {
    if (!dateRange.from) return true;
    const checkDate = new Date(year, monthIndex, 1);
    return checkDate < dateRange.from;
  };

  const getButtonText = () => {
    if (!dateRange.from) return placeholder;
    if (!dateRange.to) return `${format(dateRange.from, "MMM yyyy")} - ...`;
    return `${format(dateRange.from, "MMM yyyy")} - ${format(
      dateRange.to,
      "MMM yyyy"
    )}`;
  };

  console.log("start month", startMonth);
  console.log("start year", startYear);
  console.log("end month", endMonth);
  console.log("end Year", endYear);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative w-[calc(25%-1rem)]">
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !dateRange.from && "text-muted-foreground",
              className
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {getButtonText()}
          </Button>

          {dateRange.from && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                clearSelection();
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 p-0 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex">
          {/* Start Month Picker */}
          <div className="p-4 border-r">
            <div className="text-center mb-3">
              <h3 className="font-semibold text-sm font-mono text-black">
                Start Month
              </h3>
              {dateRange.from && (
                <p className="text-xs text-muted-foreground mt-1">
                  {format(dateRange.from, "MMMM yyyy")}
                </p>
              )}
            </div>

            <div className="space-y-3">
              {/* Start Year Navigation */}
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigateStartYear("prev")}
                  className="h-7 w-7"
                >
                  <ChevronLeft className="h-3 w-3" />
                </Button>
                <div className="text-xs font-medium">{startYear}</div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigateStartYear("next")}
                  className="h-7 w-7"
                >
                  <ChevronRight className="h-3 w-3" />
                </Button>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-1">
                  {months.map((month, index) => (
                    <Button
                      key={month}
                      variant={startMonth === index ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleStartMonthSelect(index)}
                      className="h-7 text-xs"
                    >
                      {month.slice(0, 3)}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* End Month Picker */}
          <div
            className={cn(
              "p-4",
              !dateRange.from && "opacity-50 pointer-events-none"
            )}
          >
            <div className="text-center mb-3">
              <h3 className="font-semibold text-sm font-mono">End Month</h3>
              {!dateRange.from && (
                <p className="text-xs text-muted-foreground mt-1 font-mono">
                  Select start month first
                </p>
              )}
              {dateRange.from && !dateRange.to && (
                <p className="text-xs text-muted-foreground mt-1">
                  Choose end month
                </p>
              )}
              {dateRange.to && (
                <p className="text-xs text-muted-foreground mt-1">
                  {format(dateRange.to, "MMMM yyyy")}
                </p>
              )}
            </div>

            <div className="space-y-3">
              {/* End Year Navigation */}
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigateEndYear("prev")}
                  className="h-7 w-7"
                  disabled={!dateRange.from}
                >
                  <ChevronLeft className="h-3 w-3" />
                </Button>
                <div className="text-xs font-medium">{endYear}</div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigateEndYear("next")}
                  className="h-7 w-7"
                  disabled={!dateRange.from}
                >
                  <ChevronRight className="h-3 w-3" />
                </Button>
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-1">
                  {months.map((month, index) => (
                    <Button
                      key={month}
                      variant={endMonth === index ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleEndMonthSelect(index)}
                      className={cn(
                        "h-7 text-xs",
                        isEndMonthDisabled(index, endYear) &&
                          "opacity-50 pointer-events-none"
                      )}
                    >
                      {month.slice(0, 3)}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Clear Button */}
        {dateRange.from && (
          <div className="p-3 pt-0">
            <Button
              variant="outline"
              size="sm"
              onClick={clearSelection}
              className="w-full"
            >
              Clear Selection
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
