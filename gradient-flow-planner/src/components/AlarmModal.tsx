import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Bell, CheckCircle } from "lucide-react";
import { useTasks } from "@/contexts/TaskContext";

const AlarmModal = () => {
  const { alarmTask, dismissAlarm, updateTask, showAdModal } = useTasks();

  const handleComplete = () => {
    if (alarmTask) {
      const taskTitle = alarmTask.title;
      updateTask(alarmTask.id, { isCompleted: true, progress: 100 });
      dismissAlarm();
      showAdModal({
        title: "Task Confirmed & Done! 🎉",
        subtitle: `You completed "${taskTitle}". Great job!`,
        actionType: "alarm",
        autoCloseSeconds: 5,
      });
    }
  };

  const handleDismiss = () => {
    if (alarmTask) {
      const taskTitle = alarmTask.title;
      dismissAlarm();
      showAdModal({
        title: "Task Alert Confirmed 👍",
        subtitle: `You acknowledged the alert for "${taskTitle}".`,
        actionType: "alarm",
        autoCloseSeconds: 5,
      });
    } else {
      dismissAlarm();
    }
  };

  return (
    <Dialog open={!!alarmTask} onOpenChange={handleDismiss}>
      <DialogContent className="sm:max-w-[425px] bg-blue-600 text-white border-none">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <Bell className="h-12 w-12 text-yellow-400 animate-bounce" />
          </div>
          <DialogTitle className="text-2xl font-bold text-center text-white">
            Task Alert!
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-xl font-semibold">{alarmTask?.title}</h3>
          </div>
          
          {alarmTask?.agenda && alarmTask.agenda.length > 0 && (
            <div className="bg-white/10 rounded-lg p-4">
              <h4 className="font-semibold mb-2">Agenda:</h4>
              <ul className="space-y-2">
                {alarmTask.agenda.map((item) => (
                  <li key={item.id} className="flex items-center gap-2 text-sm">
                    <span>{item.icon}</span>
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              onClick={handleComplete}
              className="flex-1 bg-green-500 text-white hover:bg-green-600"
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Mark Complete
            </Button>
            <Button
              onClick={handleDismiss}
              className="flex-1 bg-gray-500 text-white hover:bg-gray-600"
            >
              Dismiss
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AlarmModal;