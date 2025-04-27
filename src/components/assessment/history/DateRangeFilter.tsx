
import React from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarRange } from "lucide-react";
import { format } from "date-fns";

interface DateRangeFilterProps {
  startDate: Date | undefined;
  endDate: Date | undefined;
  onRangeChange: (start: Date | undefined, end: Date | undefined) => void;
}

const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  startDate,
  endDate,
  onRangeChange,
}) => {
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);

  const handleSelect = (date: Date | undefined) => {
    if (!startDate || (startDate && endDate)) {
      onRangeChange(date, undefined);
    } else {
      onRangeChange(startDate, date);
      setIsCalendarOpen(false);
    }
  };

  const dateDisplay = startDate && endDate
    ? `${format(startDate, 'MMM d, yyyy')} - ${format(endDate, 'MMM d, yyyy')}`
    : "Select date range";

  return (
    <div className="mb-4">
      <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full sm:w-auto">
            <CalendarRange className="mr-2 h-4 w-4" />
            {dateDisplay}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            selected={{
              from: startDate,
              to: endDate,
            }}
            onSelect={(range) => {
              handleSelect(range?.from);
              if (range?.to) handleSelect(range.to);
            }}
            numberOfMonths={1}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DateRangeFilter;
