export interface DateRange {
  startDate: string | undefined;
  endDate: string | undefined;
}

export interface DailyCostItem {
  index: number;
  date: string;
  cost: number;
}

export interface CardsData {
  totalCost: string;
  Sessions: number;
  "Average Cost": string;
  AverageSession: number;
}

export interface DualMonthYearPickerProps {
  startDate?: string;
  endDate?: string;
  onStartDateChange?: (date: string | undefined) => void;
  onEndDateChange?: (date: string | undefined) => void;
  placeholder?: string;
  className?: string;
}
