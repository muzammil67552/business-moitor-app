import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { useTasks } from "@/contexts/TaskContext";
import { format } from "date-fns";
import BottomNav from "@/components/BottomNav";
import AddTaskDialog from "@/components/AddTaskDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const CalendarPage = () => {
  const navigate = useNavigate();
  const { tasks, deleteTask } = useTasks();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  const tasksForSelectedDate = tasks.filter(task => {
    if (!selectedDate || !task.date) return false;
    const taskDate = new Date(task.date);
    return format(taskDate, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
  });

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="gradient-primary pt-12 pb-8 px-6 rounded-b-[36px]">
        <div className="flex items-center justify-between mb-8">
          <Button
            size="icon"
            variant="ghost"
            className="h-10 w-10 bg-white/10 hover:bg-white/20 text-white animate-press"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-white">Calendar</h1>
          <Button
            size="icon"
            variant="ghost"
            className="h-10 w-10 bg-white/10 hover:bg-white/20 text-white animate-press"
            onClick={() => setShowAddDialog(true)}
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="bg-white px-6 py-6 rounded-t-[36px] -mt-6 relative z-10 min-h-screen">
        <div className="flex justify-center mb-6">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-2xl border shadow-card"
          />
        </div>

        {selectedDate && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">
              Tasks for {format(selectedDate, 'MMMM d, yyyy')}
            </h3>
            {tasksForSelectedDate.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No tasks scheduled for this day</p>
            ) : (
              <div className="space-y-3">
                {tasksForSelectedDate.map(task => (
                  <div
                    key={task.id}
                    className="bg-card p-4 rounded-2xl shadow-card hover:shadow-elevated transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div 
                        className="flex-1 cursor-pointer"
                        onClick={() => navigate(`/task/${task.id}`)}
                      >
                        <p className="font-semibold text-foreground">{task.title}</p>
                        <p className="text-sm text-muted-foreground">{task.time}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-100"
                        onClick={() => setTaskToDelete(task.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <AddTaskDialog 
        open={showAddDialog} 
        onOpenChange={setShowAddDialog}
        defaultDate={selectedDate}
      />

      <AlertDialog open={!!taskToDelete} onOpenChange={(open) => !open && setTaskToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this task? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (taskToDelete) {
                  deleteTask(taskToDelete);
                  setTaskToDelete(null);
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <BottomNav activeTab="calendar" onTabChange={(tab) => {
        if (tab === "home") navigate("/");
      }} />
    </div>
  );
};

export default CalendarPage;
