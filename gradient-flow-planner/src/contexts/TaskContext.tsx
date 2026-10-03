import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { tasks as initialTasks } from "@/data/tasksData";
import { toast } from "sonner";

export interface Task {
  id: string;
  time: string;
  title: string;
  icon: string;
  progress: number;
  isCompleted: boolean;
  date: string;
  timeRange: string;
  description?: string;
  agenda: Array<{ id: string; icon: string; text: string }>;
  participants: string[];
  ringtone?: string;
}

export interface AdModalData {
  title: string;
  subtitle: string;
  actionType: "added" | "completed" | "alarm";
  autoCloseSeconds?: number;
  redirectTo?: string;
}

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, "id">) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  getTaskById: (id: string) => Task | undefined;
  alarmTask: Task | null;
  dismissAlarm: () => void;
  adModalData: AdModalData | null;
  isAdModalOpen: boolean;
  showAdModal: (data: AdModalData) => void;
  closeAdModal: () => void;
  isInlineAdDismissed: boolean;
  dismissInlineAd: () => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : initialTasks;
  });
  const [alarmTask, setAlarmTask] = useState<Task | null>(null);
  const [adModalData, setAdModalData] = useState<AdModalData | null>(null);
  const [isInlineAdDismissed, setIsInlineAdDismissed] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [isAlarmRinging, setIsAlarmRinging] = useState(false);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Play ringtone based on selected tone - continuous loop
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const playRingtone = (ringtone: string = "classic") => {
      if (!isAlarmRinging) return;
      
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Different ringtone patterns
      const patterns: Record<string, { freq: number[]; duration: number[] }> = {
        classic: { freq: [523, 659, 784], duration: [200, 200, 400] },
        gentle: { freq: [440, 550, 660], duration: [300, 300, 300] },
        urgent: { freq: [880, 880, 880, 880], duration: [100, 100, 100, 100] },
        chime: { freq: [523, 659, 784, 1047], duration: [150, 150, 150, 300] },
        bells: { freq: [659, 784, 1047, 784, 659], duration: [200, 200, 200, 200, 200] }
      };
      
      const pattern = patterns[ringtone] || patterns.classic;
      let time = 0;
      
      oscillator.type = "sine";
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      
      pattern.freq.forEach((freq, i) => {
        oscillator.frequency.setValueAtTime(freq, audioContext.currentTime + time);
        time += pattern.duration[i] / 1000;
      });
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + time);
      
      // Loop the ringtone continuously
      timeoutId = setTimeout(() => {
        if (isAlarmRinging) {
          playRingtone(ringtone);
        }
      }, time * 1000 + 500);
    };
    
    if (isAlarmRinging && alarmTask) {
      playRingtone(alarmTask.ringtone || "classic");
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isAlarmRinging, alarmTask]);

  // Check for upcoming tasks and show notifications
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      tasks.forEach(task => {
        if (!task.isCompleted && task.date && task.time) {
          const [hours, minutes] = task.time.split(':');
          const taskDateTime = new Date(task.date);
          taskDateTime.setHours(parseInt(hours), parseInt(minutes));
          
          const timeDiff = taskDateTime.getTime() - now.getTime();
          const secondsDiff = Math.floor(timeDiff / 1000);
          
          // Trigger alarm when time is reached (within 5 seconds window)
          if (secondsDiff >= 0 && secondsDiff <= 5 && !alarmTask) {
            setAlarmTask(task);
            setIsAlarmRinging(true);
            
            // Browser notification
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification('Task Alert!', {
                body: task.title,
                icon: '/favicon.ico'
              });
            }
          }
          
          // Notify 5 minutes before
          const minutesDiff = Math.floor(timeDiff / (1000 * 60));
          if (minutesDiff === 5) {
            toast.info(`Reminder: ${task.title} starts in 5 minutes!`, {
              duration: 5000,
            });
          }
        }
      });
    };

    // Check every second for precise alarm
    const interval = setInterval(checkReminders, 1000);
    checkReminders();
    
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    return () => clearInterval(interval);
  }, [tasks, alarmTask]);

  const addTask = (task: Omit<Task, "id">) => {
    const newTask = {
      ...task,
      id: Date.now().toString(),
    };
    setTasks(prev => [...prev, newTask]);
    toast.success("Task added successfully!");
  };

  const updateTask = (id: string, updatedTask: Partial<Task>) => {
    setTasks(prev =>
      prev.map(task => (task.id === id ? { ...task, ...updatedTask } : task))
    );
    toast.success("Task updated successfully!");
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
    toast.success("Task deleted successfully!");
  };

  const getTaskById = (id: string) => {
    return tasks.find(task => task.id === id);
  };

  const dismissAlarm = () => {
    setAlarmTask(null);
    setIsAlarmRinging(false);
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  };

  const showAdModal = (data: AdModalData) => {
    setAdModalData(data);
  };

  const closeAdModal = () => {
    setAdModalData(null);
  };

  const dismissInlineAd = () => {
    setIsInlineAdDismissed(true);
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        updateTask,
        deleteTask,
        getTaskById,
        alarmTask,
        dismissAlarm,
        adModalData,
        isAdModalOpen: !!adModalData,
        showAdModal,
        closeAdModal,
        isInlineAdDismissed,
        dismissInlineAd,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTasks must be used within a TaskProvider");
  }
  return context;
};
