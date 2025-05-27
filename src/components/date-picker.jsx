import { format, isToday, isTomorrow, isYesterday } from "date-fns"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export const DatePicker = ({ date, onDateChange }) => {
  return (
    <Popover>
        <PopoverTrigger asChild>
            <Button variant="Ghost">
                {
                  isToday(date)
                  ? "Today"
                  : isTomorrow(date)
                      ? "Tomorrow"
                      : isYesterday(date)
                          ? "Yesterday"
                          : format(date, "PPP")
                }
            </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
            <Calendar
            mode="single"
            selected={date}
            onSelect={onDateChange}
            initialFocus
            />
        </PopoverContent>
    </Popover>
  )
}