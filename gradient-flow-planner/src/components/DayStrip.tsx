import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Day {
  day: string;
  date: number;
  isToday: boolean;
}

interface DayStripProps {
  days: Day[];
  month?: string;
}

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const DayStrip = ({ days, month = "September" }: DayStripProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(month);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="bg-white px-6 pt-6 pb-4 -mt-8 relative z-10">
      <div className="text-center mb-3">
        <p className="text-2xl font-bold text-primary">
          {formatTime(currentTime)}
        </p>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2 mb-4 hover:opacity-80 transition-opacity">
          <h3 className="text-foreground font-semibold text-base">{selectedMonth}</h3>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-white z-50">
          {months.map((monthName) => (
            <DropdownMenuItem
              key={monthName}
              onClick={() => setSelectedMonth(monthName)}
              className="cursor-pointer"
            >
              {monthName}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <div className="flex justify-between gap-2">
        {days.map((day) => (
          <button
            key={day.day}
            className={`flex flex-col items-center justify-center w-14 h-16 rounded-xl transition-all animate-press ${
              day.isToday
                ? "bg-primary text-white shadow-elevated"
                : "bg-muted text-muted-foreground hover:bg-secondary"
            }`}
          >
            <span className="text-xs font-medium mb-1">{day.day}</span>
            <span className="text-lg font-semibold">{day.date}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DayStrip;
