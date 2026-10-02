import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useTasks } from "@/contexts/TaskContext";

interface AddTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultDate?: Date;
}

const AddTaskDialog = ({ open, onOpenChange, defaultDate }: AddTaskDialogProps) => {
  const { addTask, showAdModal } = useTasks();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<Date | undefined>(defaultDate);
  const [time, setTime] = useState("");
  const [icon, setIcon] = useState("mail");
  const [ringtone, setRingtone] = useState("classic");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !date || !time) {
      return;
    }

    const [hours, minutes] = time.split(':');
    const endHours = String(parseInt(hours) + 1).padStart(2, '0');
    
    addTask({
      time,
      title,
      icon,
      progress: 0,
      isCompleted: false,
      date: date.toISOString(),
      timeRange: `${time} - ${endHours}:${minutes}`,
      description,
      agenda: description ? [{ id: "a1", icon: "info", text: description }] : [],
      participants: [],
      ringtone
    });

    const scheduledTitle = title;
    const scheduledTime = time;

    // Reset form
    setTitle("");
    setDescription("");
    setDate(undefined);
    setTime("");
    setIcon("mail");
    setRingtone("classic");
    onOpenChange(false);

    showAdModal({
      title: "Task Scheduled! ⏰",
      subtitle: `Your reminder for "${scheduledTitle}" is set for ${scheduledTime}.`,
      actionType: "added",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
          <DialogDescription>Create a new task with title, description, date, time and alarm ringtone.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task description"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="icon">Icon</Label>
            <Select value={icon} onValueChange={setIcon}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mail">Mail</SelectItem>
                <SelectItem value="calendar">Calendar</SelectItem>
                <SelectItem value="smile">Smile</SelectItem>
                <SelectItem value="bell">Bell</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="time">Time</Label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ringtone">Alarm Ringtone</Label>
            <Select value={ringtone} onValueChange={setRingtone}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="classic">🎵 Classic</SelectItem>
                <SelectItem value="gentle">🎶 Gentle</SelectItem>
                <SelectItem value="urgent">⚡ Urgent</SelectItem>
                <SelectItem value="chime">🔔 Chime</SelectItem>
                <SelectItem value="bells">🎼 Bells</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Add Task
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTaskDialog;
