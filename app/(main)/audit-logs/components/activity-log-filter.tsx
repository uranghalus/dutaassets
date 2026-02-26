"use client";

import { format } from "date-fns";
import { CalendarIcon, X } from "lucide-react";
import { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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

import { useAuditLogFilterOptions } from "@/hooks/use-activity-log";
import { cn } from "@/lib/utils";

type ActivityLogFilterProps = {
  action: string;
  model: string;
  dateRange: DateRange | undefined;
  onActionChange: (value: string) => void;
  onModelChange: (value: string) => void;
  onDateRangeChange: (value: DateRange | undefined) => void;
  onReset: () => void;
};

export function ActivityLogFilter({
  action,
  model,
  dateRange,
  onActionChange,
  onModelChange,
  onDateRangeChange,
  onReset,
}: ActivityLogFilterProps) {
  const { data: filterOptions } = useAuditLogFilterOptions();

  const hasActiveFilter = action || model || dateRange?.from || dateRange?.to;

  return (
    <div className="flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2">
      {/* Action Filter */}
      <Select value={action} onValueChange={onActionChange}>
        <SelectTrigger size="sm" className="h-8 min-w-[130px]">
          <SelectValue placeholder="All Actions" />
        </SelectTrigger>
        <SelectContent>
          {filterOptions?.actions.map((a) => (
            <SelectItem key={a} value={a}>
              {a.replace(/_/g, " ")}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Model Filter */}
      <Select value={model} onValueChange={onModelChange}>
        <SelectTrigger size="sm" className="h-8 min-w-[130px]">
          <SelectValue placeholder="All Modules" />
        </SelectTrigger>
        <SelectContent>
          {filterOptions?.models.map((m) => (
            <SelectItem key={m} value={m}>
              {m}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Date Range Picker */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "h-8 justify-start text-left font-normal",
              !dateRange?.from && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-3.5 w-3.5" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, "dd MMM yyyy")} –{" "}
                  {format(dateRange.to, "dd MMM yyyy")}
                </>
              ) : (
                format(dateRange.from, "dd MMM yyyy")
              )
            ) : (
              <span>Date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={onDateRangeChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>

      {/* Reset */}
      {hasActiveFilter && (
        <Button variant="ghost" onClick={onReset} className="h-8 px-2 lg:px-3">
          Reset
          <X className="ms-2 h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
