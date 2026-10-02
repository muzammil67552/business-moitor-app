import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit2, Bell, Trash2, CheckCircle2 } from "lucide-react";
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
import AgendaItem from "@/components/AgendaItem";
import EditTaskDialog from "@/components/EditTaskDialog";
import { useTasks } from "@/contexts/TaskContext";
import { toast } from "sonner";

const TaskDetail = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const { getTaskById, deleteTask, updateTask, showAdModal } = useTasks();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const task = getTaskById(taskId || "");

  if (!task) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Task not found</p>
      </div>
    );
  }

  const handleDelete = () => {
    deleteTask(taskId || "");
    navigate("/");
  };

  const handleToggleComplete = () => {
    if (task) {
      const willBeCompleted = !task.isCompleted;
      updateTask(task.id, {
        isCompleted: willBeCompleted,
        progress: willBeCompleted ? 100 : 0,
      });
      if (willBeCompleted) {
        showAdModal({
          title: "Task Completed! 🎉",
          subtitle: `Great job finishing "${task.title}"! Keep up the momentum.`,
          actionType: "completed",
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
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
          <div className="flex gap-2">
            <Button
              size="icon"
              variant="ghost"
              className="h-10 w-10 bg-white/10 hover:bg-white/20 text-white animate-press"
              onClick={handleToggleComplete}
            >
              <CheckCircle2 className="h-5 w-5" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-10 w-10 bg-white/10 hover:bg-white/20 text-white animate-press"
              onClick={() => setShowEditDialog(true)}
            >
              <Edit2 className="h-5 w-5" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-10 w-10 bg-white/10 hover:bg-white/20 text-white animate-press"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white px-6 py-6 rounded-t-[36px] -mt-6 relative z-10 min-h-screen">
        <h1 className="text-2xl font-bold text-foreground mb-6">{task.title}</h1>
        
        {/* Date and Time Card */}
        <div className="bg-secondary px-5 py-4 rounded-2xl mb-8 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
            <Bell className="h-5 w-5 text-foreground" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">{task.date}</p>
            <p className="text-sm text-muted-foreground">{task.timeRange}</p>
          </div>
        </div>

        {/* Agenda Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-4">Agenda</h3>
          <div className="space-y-3">
            {task.agenda.map((item) => (
              <AgendaItem key={item.id} icon={item.icon} text={item.text} />
            ))}
          </div>
        </div>
      </div>

      <EditTaskDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        task={task || null}
      />

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this task? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TaskDetail;
