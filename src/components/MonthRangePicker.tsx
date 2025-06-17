"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon, ChevronLeft, ChevronRight, X } from "lucide-react";
import type { DualMonthYearPickerProps } from "@/lib/types";

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

export default function DualMonthYearPicker({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  placeholder = "Pick Dates",
  className,
}: DualMonthYearPickerProps) {
  const [open, setOpen] = useState(false);

  // Internal state for the selected dates
  const [internalStartDate, setInternalStartDate] = useState<
    string | undefined
  >(startDate);
  const [internalEndDate, setInternalEndDate] = useState<string | undefined>(
    endDate
  );

  // Parse the initial dates or use current month/year as default
  const getDefaultMonthYear = () => {
    const now = new Date();
    return {
      month: now.getMonth(),
      year: now.getFullYear(),
    };
  };

  // Parse date string "MM-YYYY"
  const parseDateString = (dateStr?: string) => {
    if (!dateStr) return getDefaultMonthYear();
    const [month, year] = dateStr.split("-").map(Number);
    return {
      month: month - 1,
      year: year,
    };
  };

  // Format month and year into "MM-YYYY" string
  const formatDateString = (month: number, year: number) => {
    return `${String(month + 1).padStart(2, "0")}-${year}`;
  };

  // Start month picker state
  const [startMonth, setStartMonth] = useState(
    parseDateString(startDate).month
  );
  const [startYear, setStartYear] = useState(parseDateString(startDate).year);

  // End month picker state
  const [endMonth, setEndMonth] = useState(parseDateString(endDate).month);
  const [endYear, setEndYear] = useState(parseDateString(endDate).year);

  useEffect(() => {
    setInternalStartDate(startDate);
    setInternalEndDate(endDate);

    if (startDate) {
      const parsed = parseDateString(startDate);
      setStartMonth(parsed.month);
      setStartYear(parsed.year);
    }
    if (endDate) {
      const parsed = parseDateString(endDate);
      setEndMonth(parsed.month);
      setEndYear(parsed.year);
    }
  }, [startDate, endDate]);

  const handleStartMonthSelect = (monthIndex: number) => {
    const newDateStr = formatDateString(monthIndex, startYear);
    setStartMonth(monthIndex);
    setInternalStartDate(newDateStr);

    // If no end date exists, automatically set it to the same as start date
    if (!internalEndDate) {
      setEndMonth(monthIndex);
      setEndYear(startYear);
      setInternalEndDate(newDateStr);
    } else {
      // If end date exists and is before new start date, set end date to match start date
      const [endMonth, endYear] = internalEndDate.split("-").map(Number);
      const newMonth = monthIndex + 1;
      const newYear = startYear;

      if (newYear > endYear || (newYear === endYear && newMonth > endMonth)) {
        setEndMonth(monthIndex);
        setEndYear(startYear);
        setInternalEndDate(newDateStr);
      }
    }
  };

  const handleEndMonthSelect = (monthIndex: number) => {
    const newDateStr = formatDateString(monthIndex, endYear);

    // Only set if start date exists and new date is after start
    if (!internalStartDate) return;

    const [startMonth, startYear] = internalStartDate.split("-").map(Number);
    const newMonth = monthIndex + 1;
    const newYear = endYear;

    if (
      newYear > startYear ||
      (newYear === startYear && newMonth >= startMonth)
    ) {
      setEndMonth(monthIndex);
      setInternalEndDate(newDateStr);
    }
  };

  const navigateStartYear = (direction: "prev" | "next") => {
    const newYear = direction === "prev" ? startYear - 1 : startYear + 1;
    setStartYear(newYear);

    if (internalStartDate) {
      const newDateStr = formatDateString(startMonth, newYear);
      setInternalStartDate(newDateStr);

      if (internalEndDate) {
        const [endMonth, endYear] = internalEndDate.split("-").map(Number);
        const startMonthNum = startMonth + 1;

        if (
          newYear > endYear ||
          (newYear === endYear && startMonthNum > endMonth)
        ) {
          setInternalEndDate(undefined);
        }
      }
    }
  };

  const navigateEndYear = (direction: "prev" | "next") => {
    const newYear = direction === "prev" ? endYear - 1 : endYear + 1;
    setEndYear(newYear);

    if (internalEndDate && internalStartDate) {
      const [startMonth, startYear] = internalStartDate.split("-").map(Number);
      const newMonth = endMonth + 1;

      if (
        newYear > startYear ||
        (newYear === startYear && newMonth >= startMonth)
      ) {
        setInternalEndDate(formatDateString(endMonth, newYear));
      }
    }
  };

  const clearSelection = () => {
    setInternalStartDate(undefined);
    setInternalEndDate(undefined);
    const now = new Date();
    setStartMonth(now.getMonth());
    setStartYear(now.getFullYear());
    setEndMonth(now.getMonth());
    setEndYear(now.getFullYear());
  };

  const handleApply = () => {
    onStartDateChange?.(internalStartDate);
    onEndDateChange?.(internalEndDate);
    setOpen(false);
  };

  const isEndMonthDisabled = (monthIndex: number, year: number) => {
    if (!internalStartDate) return true;

    const [startMonth, startYear] = internalStartDate.split("-").map(Number);
    const checkMonth = monthIndex + 1;

    return year < startYear || (year === startYear && checkMonth < startMonth);
  };

  const formatDisplay = (dateStr?: string) => {
    if (!dateStr) return "...";
    const [month, year] = dateStr.split("-");
    const monthName = months[Number.parseInt(month) - 1].slice(0, 3);
    return `${monthName} ${year}`;
  };

  const getButtonText = () => {
    if (!internalStartDate && !internalEndDate) return placeholder;
    if (!internalStartDate) return `... - ${formatDisplay(internalEndDate)}`;
    if (!internalEndDate) return `${formatDisplay(internalStartDate)} - ...`;
    return `${formatDisplay(internalStartDate)} - ${formatDisplay(
      internalEndDate
    )}`;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative w-[calc(25%-1rem)]">
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !internalStartDate && !internalEndDate && "text-muted-foreground",
              className
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {getButtonText()}
          </Button>

          {(internalStartDate || internalEndDate) && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                clearSelection();
                onStartDateChange?.(undefined);
                onEndDateChange?.(undefined);
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
              {internalStartDate && (
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDisplay(internalStartDate)}
                </p>
              )}
            </div>

            <div className="space-y-3">
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

          {/* End Month Picker */}
          <div
            className={cn(
              "p-4",
              !internalStartDate && "opacity-50 pointer-events-none"
            )}
          >
            <div className="text-center mb-3">
              <h3 className="font-semibold text-sm font-mono">End Month</h3>
              {!internalStartDate && (
                <p className="text-xs text-muted-foreground mt-1 font-mono">
                  Select start month first
                </p>
              )}
              {internalStartDate && !internalEndDate && (
                <p className="text-xs text-muted-foreground mt-1">
                  Choose end month
                </p>
              )}
              {internalEndDate && (
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDisplay(internalEndDate)}
                </p>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigateEndYear("prev")}
                  className="h-7 w-7"
                  disabled={!internalStartDate}
                >
                  <ChevronLeft className="h-3 w-3" />
                </Button>
                <div className="text-xs font-medium">{endYear}</div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigateEndYear("next")}
                  className="h-7 w-7"
                  disabled={!internalStartDate}
                >
                  <ChevronRight className="h-3 w-3" />
                </Button>
              </div>
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

        <div className="p-3 pt-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              clearSelection();
              onStartDateChange?.(undefined);
              onEndDateChange?.(undefined);
            }}
            className="w-full"
          >
            Clear Selection
          </Button>
          <Button className="mt-2 w-full" onClick={handleApply}>
            Apply
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
