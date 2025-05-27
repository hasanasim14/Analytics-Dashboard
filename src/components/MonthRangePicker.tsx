"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon, ChevronLeft, ChevronRight, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);

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
  placeholder = "Pick a date range",
  className,
}: DualMonthYearPickerProps) {
  const [dateRange, setDateRange] = React.useState<DateRange>(
    value || { from: undefined, to: undefined }
  );
  const [open, setOpen] = React.useState(false);

  // Start month picker state
  const [startMode, setStartMode] = React.useState<"month" | "year">("month");
  const [startMonth, setStartMonth] = React.useState(new Date().getMonth());
  const [startYear, setStartYear] = React.useState(new Date().getFullYear());

  // End month picker state
  const [endMode, setEndMode] = React.useState<"month" | "year">("month");
  const [endMonth, setEndMonth] = React.useState(new Date().getMonth());
  const [endYear, setEndYear] = React.useState(new Date().getFullYear());

  // Update internal state when value prop changes
  React.useEffect(() => {
    if (value) {
      setDateRange(value);
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

  const handleStartYearSelect = (year: string) => {
    const yearNum = Number.parseInt(year);
    setStartYear(yearNum);
    const newDate = new Date(yearNum, startMonth, 1);
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

  const handleEndYearSelect = (year: string) => {
    if (!dateRange.from) return;

    const yearNum = Number.parseInt(year);
    setEndYear(yearNum);
    const newDate = new Date(yearNum, endMonth, 1);

    // Only set if it's after start date
    if (newDate >= dateRange.from) {
      updateDateRange({ ...dateRange, to: newDate });
    }
  };

  const navigateStartMonth = (direction: "prev" | "next") => {
    if (direction === "prev") {
      if (startMonth === 0) {
        setStartMonth(11);
        setStartYear(startYear - 1);
      } else {
        setStartMonth(startMonth - 1);
      }
    } else {
      if (startMonth === 11) {
        setStartMonth(0);
        setStartYear(startYear + 1);
      } else {
        setStartMonth(startMonth + 1);
      }
    }
  };

  const navigateStartYear = (direction: "prev" | "next") => {
    setStartYear(direction === "prev" ? startYear - 1 : startYear + 1);
  };

  const navigateEndMonth = (direction: "prev" | "next") => {
    if (direction === "prev") {
      if (endMonth === 0) {
        setEndMonth(11);
        setEndYear(endYear - 1);
      } else {
        setEndMonth(endMonth - 1);
      }
    } else {
      if (endMonth === 11) {
        setEndMonth(0);
        setEndYear(endYear + 1);
      } else {
        setEndMonth(endMonth + 1);
      }
    }
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

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !dateRange.from && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {getButtonText()}
          {dateRange.from && (
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto h-4 w-4 p-0 hover:bg-transparent"
              onClick={(e) => {
                e.stopPropagation();
                clearSelection();
              }}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </Button>
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

            {/* Start Mode Toggle */}
            <div className="flex gap-1 mb-3">
              <Button
                variant={startMode === "month" ? "default" : "outline"}
                size="sm"
                onClick={() => setStartMode("month")}
                className="flex-1 text-xs"
              >
                Month
              </Button>
              <Button
                variant={startMode === "year" ? "default" : "outline"}
                size="sm"
                onClick={() => setStartMode("year")}
                className="flex-1 text-xs"
              >
                Year
              </Button>
            </div>

            {startMode === "month" ? (
              <div className="space-y-3">
                {/* Start Month Navigation */}
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => navigateStartMonth("prev")}
                    className="h-7 w-7"
                  >
                    <ChevronLeft className="h-3 w-3" />
                  </Button>
                  <div className="text-xs font-medium">
                    {months[startMonth]} {startYear}
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => navigateStartMonth("next")}
                    className="h-7 w-7"
                  >
                    <ChevronRight className="h-3 w-3" />
                  </Button>
                </div>

                {/* Start Month Grid */}
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
            ) : (
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

                {/* Start Year Select */}
                <Select
                  value={startYear.toString()}
                  onValueChange={handleStartYearSelect}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
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

            {/* End Mode Toggle */}
            <div className="flex gap-1 mb-3">
              <Button
                variant={endMode === "month" ? "default" : "outline"}
                size="sm"
                onClick={() => setEndMode("month")}
                className="flex-1 text-xs"
                disabled={!dateRange.from}
              >
                Month
              </Button>
              <Button
                variant={endMode === "year" ? "default" : "outline"}
                size="sm"
                onClick={() => setEndMode("year")}
                className="flex-1 text-xs"
                disabled={!dateRange.from}
              >
                Year
              </Button>
            </div>

            {endMode === "month" ? (
              <div className="space-y-3">
                {/* End Month Navigation */}
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => navigateEndMonth("prev")}
                    className="h-7 w-7"
                    disabled={!dateRange.from}
                  >
                    <ChevronLeft className="h-3 w-3" />
                  </Button>
                  <div className="text-xs font-medium">
                    {months[endMonth]} {endYear}
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => navigateEndMonth("next")}
                    className="h-7 w-7"
                    disabled={!dateRange.from}
                  >
                    <ChevronRight className="h-3 w-3" />
                  </Button>
                </div>

                {/* End Month Grid */}
                <div className="grid grid-cols-3 gap-1">
                  {months.map((month, index) => {
                    const isDisabled = isEndMonthDisabled(index, endYear);
                    const isSelected = endMonth === index && dateRange.to;

                    return (
                      <Button
                        key={month}
                        variant={isSelected ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleEndMonthSelect(index)}
                        disabled={isDisabled}
                        className="h-7 text-xs"
                      >
                        {month.slice(0, 3)}
                      </Button>
                    );
                  })}
                </div>
              </div>
            ) : (
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

                {/* End Year Select */}
                <Select
                  value={endYear.toString()}
                  onValueChange={handleEndYearSelect}
                  disabled={!dateRange.from}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
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
