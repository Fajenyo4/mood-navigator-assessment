
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

interface TimeRangeFilterProps {
  onRangeChange: (startDate: Date | undefined, endDate: Date | undefined) => void;
}

const TimeRangeFilter = ({ onRangeChange }: TimeRangeFilterProps) => {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [startOpen, setStartOpen] = useState(false);
  const [endOpen, setEndOpen] = useState(false);

  const handleStartDateChange = (date: Date | undefined) => {
    setStartDate(date);
    onRangeChange(date, endDate);
    setStartOpen(false);
  };

  const handleEndDateChange = (date: Date | undefined) => {
    setEndDate(date);
    onRangeChange(startDate, date);
    setEndOpen(false);
  };

  const resetFilter = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    onRangeChange(undefined, undefined);
  };

  return (
    <div className="flex items-center gap-2 mb-4">
      <Popover open={startOpen} onOpenChange={setStartOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            {startDate ? format(startDate, 'MMM d, yyyy') : 'Start Date'}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={startDate}
            onSelect={handleStartDateChange}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      <span>to</span>

      <Popover open={endOpen} onOpenChange={setEndOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            {endDate ? format(endDate, 'MMM d, yyyy') : 'End Date'}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={endDate}
            onSelect={handleEndDateChange}
            initialFocus
            disabled={(date) => (startDate ? date < startDate : false)}
          />
        </PopoverContent>
      </Popover>

      {(startDate || endDate) && (
        <Button variant="ghost" onClick={resetFilter} className="h-9 px-2">
          Clear
        </Button>
      )}
    </div>
  );
};

export default TimeRangeFilter;
